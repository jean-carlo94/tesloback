import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Repository } from "typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";

import { User } from '../entities';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){

    constructor(
        @InjectRepository( User )
        private readonly useRepository: Repository<User>,
        configService: ConfigService
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    };

    async validate( payload:JwtPayload ): Promise<User>{

        const { id } = payload;

        const user = await this.useRepository.findOneBy({ id });

        if( !user ) throw new UnauthorizedException('Token not valid');

        if( !user.isActive ) throw new UnauthorizedException('User is inactive, talk with an admin');
        
        return user;
    }

}