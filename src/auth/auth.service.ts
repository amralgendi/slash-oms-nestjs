import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon from 'argon2';
import { AuthDto } from './dto';
import { UsersRepository } from 'src/users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  private tokenSecret: string;

  constructor(
    private userRepository: UsersRepository,
    private jwtService: JwtService,
    config: ConfigService,
  ) {
    this.tokenSecret = config.get('TOKEN_SECRET');
  }

  private async generateTokens(
    idTokenPayload: object,
    accessTokenPayload: object,
  ) {
    const idToken = await this.jwtService.signAsync(idTokenPayload, {
      secret: this.tokenSecret,
    });
    const accessToken = await this.jwtService.signAsync(accessTokenPayload, {
      secret: this.tokenSecret,
    });

    return {
      idToken,
      accessToken,
    };
  }

  async signup({ email, password }: AuthDto) {
    // CHECK IF EMAIL EXIST - THIS IS OPTIONAL SINCE WE ALREADY USE THE CREATE METHOD FROM THE USER REPOSITORY

    // GENERATE HASH
    const hash = await argon.hash(password);

    // SAVE USER
    const user = await this.userRepository.create({
      email,
      hash,
    });
    delete user.hash;

    const idTokenPayload = {
      sub: user.id,
      email,
      name: user.name,
      address: user.address,
    };

    return await this.generateTokens(idTokenPayload, { sub: user.id });
  }

  async signin({ email, password }) {
    const user = await this.userRepository.getByEmail(email);

    if (!user) {
      throw new ForbiddenException('Wrong Credentials!');
    }

    if (!(await argon.verify(user.hash, password))) {
      throw new ForbiddenException('Wrong Credentials!');
    }

    const idTokenPayload = {
      sub: user.id,
      email,
      name: user.name,
      address: user.address,
    };

    return await this.generateTokens(idTokenPayload, { sub: user.id });
  }

  async me({ id }: { id: number }) {
    const user = await this.userRepository.getById(id);

    delete user.hash;
    return user;
  }
}
