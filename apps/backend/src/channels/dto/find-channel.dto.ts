import { FindUserDto } from "@/users/dto";
import { ApiResponseProperty } from "@nestjs/swagger";
import { channelTypes } from "../channel.entity";
import { MessageDto } from "./message.dto";

export class FindChannelDto {
  @ApiResponseProperty({ type: String, format: "uuid" })
  id: string;

  @ApiResponseProperty({ type: String, enum: channelTypes, example: "dm" })
  type: "dm";

  @ApiResponseProperty({ type: MessageDto })
  lastMessage: MessageDto | null;

  @ApiResponseProperty({ type: [FindUserDto] })
  members: Array<FindUserDto>;

  @ApiResponseProperty({ type: Date, format: "date-time" })
  createdAt: Date;

  @ApiResponseProperty({ type: Date, format: "date-time" })
  updatedAt: Date;
}
