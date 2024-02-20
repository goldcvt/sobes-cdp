import { Body, Controller, Get, Inject, Post, Query, Req, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { JwtGuard } from './roles.guard';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { DataSource } from 'typeorm';
import _ from 'lodash';

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    ) {}

  @Post('register')
  async register(@Body() data: RegisterDto) {
    await this.authService.register(data);
  }

  @Get('login')
  login(@Query() login: LoginDto) {
    return this.authService.login(login.login, login.password);
  }

  @Post('profile')
  @UseGuards(JwtGuard)
  getProfile(@Req() request: any) {
    return request.user;
  }
}
