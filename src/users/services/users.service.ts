import { Injectable } from '@nestjs/common';

import { User } from '../models';
import { Users as UserEntity } from '../../database/entities/users.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepo: Repository<UserEntity>,
  ) {}

  async findOne(userId: string): Promise<User> {
    try {
      const userEntity = await this.usersRepo.findOne({
        where: { id: userId },
      });

      return {
        ...userEntity,
      };
    } catch (e) {
      throw e;
    }
  }

  async createOne({ name, password }: User): Promise<User> {
    try {
      const userCreateResult = await this.usersRepo.insert({
        name,
        password,
      });

      return {
        id: userCreateResult.raw[0].id,
        name,
        password,
      };
    } catch (e) {
      throw e;
    }
  }
}
