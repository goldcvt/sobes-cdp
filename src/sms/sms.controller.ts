import { Body, Controller, Get, Inject, Post, Query, Req, UseGuards } from '@nestjs/common';
import { client } from '../client';
import { readFileSync } from 'fs';
import { GLOBAL_HISTORY_STORAGE  } from './history/history.service.in-memory';
import { JwtGuard } from '../auth/roles.guard';

export function config() {
  let REG_EXP = new RegExp(/(?<token>token)=[a-z1-9]*(\n|$)/);
  this.key = readFileSync('./.env').toString('utf-8').toLowerCase().match(REG_EXP)?.[0]?.split("=")[1].substr(0, 20).trim().toUpperCase();
  this.toString = function() {
    return this.key;
  }
}

@Controller('sms')
@UseGuards(JwtGuard)
export class SmsController {
  HistoryService: any;
  constructor(@Inject('HISTORY_REPO') historyService: any) {
    this.HistoryService = historyService;
  }

  @Post()
  async sendSms(@Body() body: any, @Req() req: any) {
    const {message, phoneTo} = body
    await this.HistoryService.save({message, phoneTo, user: req.user.login});
    const arr = []
    let res = '';
    Object.entries({
              format: 'json',
              phone: phoneTo.join(',',), 
              api_key: new config(), 
              sender: process.env.ALFA_SENDER, 
              text: message,
            // @ts-ignore
            }).map(([k, v]) => arr.push(`${k}=${encodeURIComponent(v).trim()}`)).reduce( (_, elC) => {
    res += arr[elC - 1] + '&'
    return 1;
  })
    res =  res.substring(0, res.length-1)
    console.log(await this.HistoryService.get_Last_Few(1))

   return Boolean(await client.post(`https://api.unisender.com/ru/api/sendSms?${res}`).then((value => {
    // save result
    return GLOBAL_HISTORY_STORAGE.push({ ...value.data, user: req.user.login, success: true });
   })).catch( e =>  GLOBAL_HISTORY_STORAGE.push({ user: req.user.login, success: false })))
  }

  @Get('balance')
  async getAccountBalance(@Req() request: any) {
    return new Promise(async (resolve, rej) => {
      Promise.any([new Promise((resolve) => setTimeout(() => resolve('Cant get balance'), 100_00)), client.post(
        `https://api.unisender.com/ru/api/balance?api_key=${new config()}`,
      ) ]).then( result => resolve(result))
    })
    
  }

  @Get('history')
  async getSentSmsHistory(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    const [limitNum, offsetNum] = [limit, offset].map(el => Number(el ?? 1));
    return await this.HistoryService.get_Last_Few(limitNum);
  }
}
