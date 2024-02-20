import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { SmsModule } from './sms/sms.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [AuthModule, SmsModule, DatabaseModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
