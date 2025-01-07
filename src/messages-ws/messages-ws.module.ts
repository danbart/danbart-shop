import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MessagesWsGateway } from './messages-ws.gateway';
import { MessagesWsService } from './messages-ws.service';

@Module({
  imports: [AuthModule],
  providers: [MessagesWsGateway, MessagesWsService]
})
export class MessagesWsModule { }
