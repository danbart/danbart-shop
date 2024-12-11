import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { IncomingHttpHeaders } from 'http';
import { AuthService } from './auth.service';
import { Auth, GestUser, RawHeaders } from './decorators/';
import { RoleProtected } from './decorators/role-protected.decorator';
import { CreateAuthDto, LoginAuthDto } from './dto';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { ValidRoles } from './interface';

@ApiTags('Auth')
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

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GestUser() user: User
  ) {
    return this.authService.checkAuthStatus(user);
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

  // @SetMetadata('roles', ['admin', 'super-user'])
  @Get('private2')
  @RoleProtected(ValidRoles.ADMIN, ValidRoles.SUPER_USER)
  @UseGuards(AuthGuard(), UserRoleGuard)
  getPrivateData2(
    @GestUser() user: User,
  ) {
    return {
      message: "This is a private route",
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.ADMIN, ValidRoles.SUPER_USER)
  getPrivateData3(
    @GestUser() user: User,
  ) {
    return {
      message: "This is a private route",
      user,
    };
  }


}
