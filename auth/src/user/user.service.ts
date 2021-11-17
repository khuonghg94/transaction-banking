import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async getInfoByEmail(email: string){
    return await this.userRepository.findOne({ email });
  }
}