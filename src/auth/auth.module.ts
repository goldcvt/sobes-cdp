import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { JwtGuard } from './roles.guard';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard],
  exports: [JwtGuard, AuthService]
})
export class AuthModule {}
