import { Controller, Delete, Param } from '@nestjs/common';
import { AllowedRoles } from '../../common/decorator/role.decorator';
import { UserService } from './user.service';
import { ROLE } from '../../common/constant/app.constant';

@Controller({
  path: '/admin/user',
})
export class AdminUserController {
  constructor(private readonly userService: UserService) {}

  @Delete(':id')
  @AllowedRoles([ROLE.ADMIN])
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUsers([Number(id)]);
  }
}
