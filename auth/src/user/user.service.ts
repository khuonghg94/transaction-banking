import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getConnection } from 'typeorm';
import UserEntity from './entity/user.entity';
import UserDto from './dto/user.dto';
 
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}
 
  async isUserExisted(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (user) {
        return true;
    }
    return false;
  }
 
  async create(data: UserDto) {
    const newUser = await this.userRepository.create(data);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async update(data: UserDto){
    await getConnection()
      .createQueryBuilder()
      .update(UserEntity)
      .set({ username: data.username, password: data.password})
      .where("email = :email", {email : data.email})
      .execute();
    return data;
  }

  async delete(email: string){
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .where("email = :email", {email : email})
      .execute();
    return { message: 'User is deleted successfully'};
  }

  async getInfoByEmail(email: string){
    return await this.userRepository.findOne({ email });
  }
}