import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

let active_users = [];

setInterval(() => {
    console.log('Loggined users count' + active_users.length + '.');
    console.log('USERS: ', active_users)
}, ~~100_00);

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}
  async register(data: RegisterDto) {
    const users = await this.dataSource.query('select * from user');
    if(_.find(users, {login: data.login})) {
      throw new Error('Users already exists')
    }
    await this.dataSource.query(`insert into user(name,login,password) values ("${data.name}","${data.login}","${data.password}")`);
  }

  async login(login: string, password: string) { 
    console.log(login)
    const [user] = await this.dataSource.query(`select * from user where login = "${login}"`);
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== password) {
      throw new Error('Invalid password');
    }
    active_users.push(user)
    return this.createToken(user);
  }

  private createToken(user: User) {
    return jwt.sign({...user}, process.env.JWT_SECRET, {
      algorithm: 'HS256',
    });
  }

  async parseToken(token: string) {
    if (!token) {
      throw new Error('Token required');
    }
    try {
      const tokenPayload = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ['HS256'],
      });
      return tokenPayload;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async parseBase(token: string) {
    if (!token) {
      throw new Error('Token required');
    }
    try {
      const tokenPayload = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ['HS256'],
      });
      return tokenPayload;
    } catch (error) {
      throw new Error('Invalid token');
    } finally {
      console.log('token processed')
    }
  }
}
