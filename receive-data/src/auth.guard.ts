import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from './config/config.service';
import TokenDto from './data-import/dto/token.dto';
const axios = require('axios');

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request).then(data => { return data.result; });
  }
  constructor(
    private configService: ConfigService
  ) {
  }
  public async validateRequest(request: any) : Promise<any>{
    const authHeaders = request.headers.authorization;
    const token = authHeaders.replace('Bearer ', '');
    const tokenDto = new TokenDto();
    tokenDto.token = token;
    const params = JSON.stringify(tokenDto);
    const promise = axios.post(this.configService.get('AUTH_SERVER_URL'),
      params,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    const dataPromise = promise.then((response) => response.data)
    return dataPromise;
  }
}
