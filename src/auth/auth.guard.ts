import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  private tokenSecret: string;
  constructor(
    private jwtService: JwtService,
    config: ConfigService,
  ) {
    this.tokenSecret = config.get('TOKEN_SECRET');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.tokenSecret,
      });

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers

      request['user'] = payload;

      // if (!(await this.userRepository.getById(payload.sub))) {
      //   throw new UnauthorizedException();
      // }
    } catch (e) {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
