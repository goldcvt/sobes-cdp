import { Controller, Get, Post } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  info(): string {
    return `Привет! Это приложение для оправки смс сообщений! Подробную информацию получи по адресу /help`;
  }

  @Post()
  help(): string {
    return 'Для начала работы войди в систему (/login), а дальше используй (/sms) для отправки сообщений';
  }
}
