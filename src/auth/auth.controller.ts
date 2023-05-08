import { Controller, Get, Post, Body, UseGuards, Req, Headers } from '@nestjs/common';
import { GetRawHeaders } from 'src/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser, RoleProtected } from './decorators';
import { User } from './entities';
import { UseRoleGuard } from './guards/use-role.guard';
import { ValideRoles } from './interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  };

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.login( loginUserDto );
  };

  
  @Get('check-auth-status')
  @Auth()
  checkAuthStatus( @GetUser() user: User ){
    return this.authService.checkAuthStatus( user );
  };

  @Get('private')
  @UseGuards( AuthGuard() )
  testingPrivateRoute(
    @Req() request: Express.Request, //MeTodo Manual
    @GetUser() user: User, //Método Personalizado 
    @GetUser('email') userEmail:string, //Método Propiedad Especifica

    @Headers() headers: IncomingHttpHeaders,// Método Automático NEST
    @GetRawHeaders() rawHeaders: string[],//Método personalizado para Headers
  ){    
    return{
      ok: true,
      message: 'Hola mundo',
      user,
      userEmail,
      rawHeaders,
      headers,
    }
  };

  //Metadata para sacar los roles no se usa mucho
  //@SetMetadata('roles',['admin','super-user'])

  @Get('private2')
  @RoleProtected( ValideRoles.superUser, ValideRoles.admin )
  @UseGuards( AuthGuard(), UseRoleGuard )
  testingPrivateRoute2(
    @GetUser() user: User, //Método Personalizado 
  ){    
    return{
      ok: true,
      message: 'Hola mundo',
      user,
    }
  };

  @Get('private3')
  @Auth( ValideRoles.admin, ValideRoles.superUser )
  privateRoute3(
    @GetUser() user: User,
  ){    
    return{
      ok: true,
      message: 'Hola mundo',
      user,
    }
  };
}
