import { WsGuard } from "@/auth/guards/ws.guard";
import { ChannelsService } from "@/channels/channels.service";
import { HttpExceptionFilter } from "@/http-exception.filter";
import { UsersService } from "@/users/users.service";
import { Inject, Logger, UseFilters, UseGuards } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from "@nestjs/websockets";
import { Socket } from "socket.io";

@UseGuards(WsGuard)
@UseFilters(HttpExceptionFilter)
@WebSocketGateway({
  namespace: "/chat",
  path: "/api/socket.io",
})
export class ChatGateway implements OnGatewayConnection {
  logger = new Logger("ChatGateway");

  @Inject()
  channelsService: ChannelsService;
  @Inject()
  usersService: UsersService;

  async handleConnection(@ConnectedSocket() client: Socket) {
    const { request } = client;

    if (!request.isAuthenticated()) {
      this.logger.log("Disconnected unauthorized client");
      client.disconnect(true);
      return;
    }
  }

  @SubscribeMessage("fetchChannels")
  async handleFetchChannels(@ConnectedSocket() client: Socket) {
    const loggedInUser = client.request.user;
    const channels = await this.channelsService.findUserChannels(loggedInUser);
    client.emit("channelsList", channels);
  }

  @SubscribeMessage("enterDmChat")
  async handleEnterDmChat(@ConnectedSocket() client: Socket, @MessageBody() username: string) {
    const loggedInUser = client.request.user;
    const dmUser = await this.usersService.findOneByUsernameForUser(loggedInUser, username);

    if (!dmUser) {
      throw new WsException(`User not found: ${username}`);
    }
    let channel = await this.channelsService.findDmChannel(loggedInUser, dmUser);
    if (!channel) {
      channel = await this.channelsService.createDmChannel(loggedInUser, dmUser);
    }
    client.join(channel.id);
    return {
      ...channel,
      messages: await this.channelsService.findChannelMessages(channel.id),
    };
  }

  @SubscribeMessage("enterGroupChat")
  async handleEnterGroupChat(@ConnectedSocket() client: Socket, @MessageBody() channelId: string) {
    const loggedInUser = client.request.user;
    const channel = await this.channelsService.findChannelById(loggedInUser, channelId);

    client.join(channel.id);
    return {
      ...channel,
      messages: await this.channelsService.findChannelMessages(channel.id),
    };
  }

  @SubscribeMessage("leaveChannel")
  async handleLeaveChannel(@ConnectedSocket() client: Socket, @MessageBody() channelId: string) {
    client.leave(channelId);
  }

  @SubscribeMessage("sendMessage")
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { channelId: string; content: string },
  ) {
    const author = client.request.user;
    const { channelId, content } = data;

    const message = await this.channelsService.sendMessage(channelId, author.id, content);
    client.to(channelId).emit("newMessage", message);
    return message;
  }
}
