import { Body, Controller, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { AllowedRoles } from '../../common/decorator/role.decorator';
import { ROLE } from '../../common/constant/app.constant';
import { AuthUser } from '../../common/decorator/auth.decorator';
import { AuthPayload, UpdateUserDto } from '@full-stack/utils';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  async handleGetUser(creator_id: number) {
    const rs = await this.userService.getUserById(creator_id);

    return rs.toJSON();
  }

  @Get('profile')
  @AllowedRoles([ROLE.USER, ROLE.ADMIN])
  getUserInfo(@AuthUser() user: AuthPayload) {
    return this.userService.getUserById(user.id);
  }

  @Put()
  @AllowedRoles([ROLE.USER, ROLE.ADMIN])
  updateUser(@AuthUser() user: AuthPayload, @Body() data: UpdateUserDto) {
    return this.userService.updateUser(user.id, data);
  }
}
