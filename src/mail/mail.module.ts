import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { NodemailerService } from './nodemail.service';
import { IMailerServiceSymbol } from './interface/mailer.interface';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [MailController],
  providers: [{
    provide: IMailerServiceSymbol,
    useClass: NodemailerService
  }, UserService]
})
export class MailModule {}
