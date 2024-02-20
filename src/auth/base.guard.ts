import { AuthService } from './auth.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import _ from 'lodash'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
@Injectable()
export class BaseGuard implements CanActivate {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource
    ) {}

  BASE_AUTH_SPLITTER = ':';

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { pass } = request.query;

    const pass_ = new Buffer(pass, 'base64').toString();

    const [login, _pass] = _.split(pass_, this.BASE_AUTH_SPLITTER);
    const user = await this.userRepo.findOne({where: {login}});
    if(!user) {
      throw new Error('User not found');
    }
    if(user.password !== _pass) {
      throw new Error('Invalid password');
    }

    request.user = user;

    return true;
  }
}
