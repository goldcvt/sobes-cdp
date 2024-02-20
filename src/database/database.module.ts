import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3308,
      username: 'mikhail_dmitryev',
      password: 'd2so39gt003ls',
      database: 'test',
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
