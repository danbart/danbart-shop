import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { GestUser, RawHeaders } from './decorators/';
import { CreateAuthDto, LoginAuthDto } from './dto';
import { User } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  createUser(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);

  }
  @Post('login')
  loginUser(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  getPrivateData(
    // @Req() req: Express.Request
    @GestUser() user: User,
    @GestUser('email') userEmail: string,
    @RawHeaders() token: string[],
    @Headers() headers: IncomingHttpHeaders
  ) {
    // console.log({ user: req.user });
    return {
      message: "This is a private route",
      user,
      userEmail,
      token,
      headers
    };
  }


}
