import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { NodemailerService } from './nodemail.service';
import { IMailerService, IMailerServiceSymbol } from './interface/mailer.interface';

@Module({
  controllers: [MailController],
  providers: [{
    provide: IMailerServiceSymbol,
    useClass: NodemailerService
  }]
})
export class MailModule {}
