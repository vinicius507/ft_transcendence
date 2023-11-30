import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ListUsersDto, UpdateUserDto } from "./dto";
import { User } from "./user.entity";
import { IsAuthenticatedGuard } from "src/auth/guards/authenticated.guard";
import { SelfGuard } from "src/auth/guards/self.guard";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(IsAuthenticatedGuard)
  findAll(@Query() listUsersDto: ListUsersDto): Promise<User[]> {
    return this.usersService.findAll(listUsersDto?.offset, listUsersDto?.limit);
  }

  @Get(":username")
  @UseGuards(IsAuthenticatedGuard)
  findOne(@Param("username") username: string): Promise<User> {
    return this.usersService.findOneByUsername(username);
  }

  @Patch(":username")
  @UseGuards(IsAuthenticatedGuard, SelfGuard)
  update(
    @Param("username") username: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(username, updateUserDto);
  }
}
