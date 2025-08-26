import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from '@full-stack/utils';
import { User } from './model/user.model';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  @InjectModel(User)
  private readonly userModel: typeof User;

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto);

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userModel.findOne({ where: { email: email } });

    return user;
  }

  async getUserById(userId: number) {
    const user = await this.userModel.findOne({ where: { id: userId } });

    return user;
  }

  async updateUser(userId: number, data: UpdateUserDto) {
    const { first_name, last_name } = data;

    const rs = await User.update(
      {
        first_name: first_name,
        last_name: last_name,
      },
      {
        where: {
          id: userId,
        },
        returning: true,
      }
    );

    return rs[1][0];
  }

  async deleteUsers(userIds: number[]) {
    await User.destroy({
      where: {
        id: {
          [Op.in]: userIds,
        },
      },
    });

    return;
  }
}
