import { Module } from '@nestjs/common';
import { RegisterService } from './register.service';
import { RegisterController } from './register.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Register } from './entities/register.entity';
import { MailerService } from './mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Register
    ])
  ],
  controllers: [RegisterController],
  providers: [RegisterService, MailerService],
})
export class RegisterModule {}
