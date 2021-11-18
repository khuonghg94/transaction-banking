import { Controller, Post, Body} from '@nestjs/common';
import { AuthService } from './auth.service';
import GenerateTokenDto from './dto/generate-token.dto';
import RegisterDto from './dto/register.dto';
import TokenDto from './dto/token.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
      ) {}
     
    @Post('register')
    async register(@Body() registerUser: RegisterDto) {
        return this.authService.register(registerUser);
    }

    @Post('update')
    async update(@Body() updUser: RegisterDto) {
        return this.authService.update(updUser);
    }

    @Post('delete')
    async delete(@Body() delUser: RegisterDto) {
        return this.authService.delete(delUser);
    }

    @Post('token')
    async getToken(@Body() tokenDto: GenerateTokenDto) {
        return this.authService.getToken(tokenDto);
    }

    @Post('verify')   
    async verify(@Body() tokenVerify: TokenDto) : Promise<any>{
        return this.authService.validateToken(tokenVerify);
    } 
}
