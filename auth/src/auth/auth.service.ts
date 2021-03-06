import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import RegisterDto from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import GenerateTokenDto from './dto/generate-token.dto';
import TokenDto from './dto/token.dto';
import UserDto from '../user/dto/user.dto';
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'BANK-RECONCILIATION';
const numberTimeExpired = 900000;

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService
    ) {}
    public async register(dataRegister: RegisterDto) {
        const hashedPassword = await bcrypt.hash(dataRegister.password, 10);
        try{
            if (await this.userService.isUserExisted(dataRegister.email) === false){
                const createdUser = await this.userService.create({
                    ...dataRegister,
                    password: hashedPassword
                });
                createdUser.password = undefined;
                return createdUser;
            }
            else{
                return { message: 'User with that email already exists' , statusCode: HttpStatus.BAD_REQUEST}
            }
        } 
        catch{
            return { message: 'Register user failed' , statusCode: HttpStatus.INTERNAL_SERVER_ERROR}
        }
    }
    public async update(dataUpd: RegisterDto) {
        const hashedPassword = await bcrypt.hash(dataUpd.password, 10);
        try{
            if (await this.userService.isUserExisted(dataUpd.email) === true){
                const userDto = new UserDto();
                userDto.email = dataUpd.email;
                userDto.username = dataUpd.username;
                userDto.password = hashedPassword;
                return await this.userService.update(userDto);
            }
            else{
                return { message: 'User is not existed' , statusCode: HttpStatus.BAD_REQUEST}
            }
        }
        catch{
            return { message: 'Update user failed' , statusCode: HttpStatus.INTERNAL_SERVER_ERROR}
        }
    }
    public async delete(delUser: RegisterDto) {
        try{
            if (await this.userService.isUserExisted(delUser.email) === true){
                return this.userService.delete(delUser.email);
            }
            else{
                return { message: 'User is not existed' , statusCode: HttpStatus.BAD_REQUEST}
            }
        }
        catch{
            return { message: 'Delete user failed' , statusCode: HttpStatus.INTERNAL_SERVER_ERROR}
        }
    }
    public async getToken(dataToken: GenerateTokenDto){
        const expired = new Date();
        // Expired after 15 minutes
        expired.setMilliseconds(expired.getMilliseconds() + numberTimeExpired);
        return { token: jwt.sign({
            email: dataToken.email,
            username: dataToken.username,
            password: dataToken.password,
            exp: Math.floor(expired.getTime() / 1000),
        }, SECRET_KEY) };
    }
    public async validateToken(tokenVerify: TokenDto) : Promise<any>{
        const that = this;
        return jwt.verify(tokenVerify.token, SECRET_KEY, async function(err, decoded) {
            if(err){
                return { result : false, message: 'Invalid token' };
            }
            else{
                const verified = await that.verifyUser(decoded.email, decoded.username, decoded.password);
                if (verified.result) {
                    return { result : true, message: 'Valid token'  };
                }
                else{
                    return { result : false, message: 'Authenticate failed' };
                }
            }
        });
    }
    public async verifyUser(email: string, username: string, passwordHash: string) : Promise<any>{
        if (!this.userService.isUserExisted(email)){
            return { result : false };
        }
        else{
            const userRO = await this.userService.getInfoByEmail(email);
            if (userRO){
                const isPasswordMatching = await bcrypt.compare(
                    passwordHash,
                    userRO.password
                );
                if (username === userRO.username && isPasswordMatching) return { result : true };
            }
            return { result : false };
        }
    }
}
