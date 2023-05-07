import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ){}

  async create(createUserDto: CreateUserDto) {

    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync( password, 10 )
      });
      
      await this.userRepository.save( user );
      delete user.password;
      
      return {
        ...user,
        token: this.getJwtToken({ id: user.id, email: user.email })
      };
      
    } catch (error) {
      this.handleDbExceptions( error )
    }
  };

  async login( loginUserDto: LoginUserDto ){

    const { password, email } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { id:true, email: true, password: true }
    });

    if( !user) throw new UnauthorizedException('Credentials are not valid (email)');

    if( !bcrypt.compareSync(password, user.password) ) throw new UnauthorizedException('Credentials are not valid (password)');
    console.log(user);
    
    return {
      ...user,
      token: this.getJwtToken({ id: user.id, email: user.email })
    };
  };

  private getJwtToken( payload:JwtPayload ){
    const token = this.jwtService.sign( payload );
    return token
  };

  private handleDbExceptions( error:any ): never {
    if( error.code === '23505' ) throw new BadRequestException(error.detail);

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');   
  };
}
