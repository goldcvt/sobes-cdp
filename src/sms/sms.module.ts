import { Module } from '@nestjs/common';
import { SmsController } from './sms.controller';
import { HistoryServiceModule } from './history/history.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HistoryServiceModule, AuthModule],
  controllers: [SmsController],
})
export class SmsModule {}
