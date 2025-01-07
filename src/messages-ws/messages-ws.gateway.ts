import { JwtService } from '@nestjs/jwt';
import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtPayload } from '../auth/interface';
import { NewMessagesDto } from './dto/new-messages.dto';
import { MessagesWsService } from './messages-ws.service';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) { }
  async handleConnection(client: Socket,) {
    const token = client.handshake.headers.authorization;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);

    } catch (error) {
      client.disconnect();
      return;
    }
    console.log("🚀 ~ MessagesWsGateway ~ handleConnection ~ payload:", payload)
    // console.log('Cliente conectado.', client.id);
    // console.log({ conectados: this.messagesWsService.getConnectedClients() });
    this.wss.emit('connected-clients', this.messagesWsService.getConnectedClients());
  }
  handleDisconnect(client: Socket) {
    // console.log('Cliente Desconectado.', client.id);
    this.messagesWsService.removeClient(client.id);
    // console.log({ conectados: this.messagesWsService.getConnectedClients() });
    this.wss.emit('connected-clients', this.messagesWsService.getConnectedClients());
  }

  @SubscribeMessage('message-from-client')
  handleMessageFromClient(client: Socket, payload: NewMessagesDto) {
    // console.log('Mensaje recibido.', payload);
    console.log("🚀 ~ MessagesWsGateway ~ handleMessageFromClient ~ payload:", payload)
    //! emite unicamente al cliente
    // client.emit('message-from-server', payload);

    //! emite a todos los clientes conectados
    // client.broadcast.emit('message-from-server', payload);
    this.wss.emit('message-from-server', { fullName: this.messagesWsService.getUserFullNameBySocketId(client.id), message: payload.message });
  }

}
