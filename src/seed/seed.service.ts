import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';
import { User } from 'src/auth/entities';

@Injectable()
export class SeedService {
  
  constructor(
      private readonly productsService:ProductsService,
      
      @InjectRepository( User )
      private readonly userRepository: Repository<User>,
  ){}

  async runSeed(){
    await this.clearDataBase();
    const adminUser = await this.insertUsers();
    await this.insertNewProducts( adminUser );
    return 'SEED EXECUTED'
  };

  private async insertUsers(){
    
    const seedUser = initialData.users;

    const users: User[] = [];

    seedUser.forEach( user => {
       const newUser = this.userRepository.create({
          ...user,
          password: bcrypt.hashSync( user.password, 10 )
        });

        users.push( this.userRepository.create( newUser ) )
    });

    await this.userRepository.save( users );
    return users[0];

  };

  private async clearDataBase(){
    await this.productsService.deleAllProducts();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute()
  };

  private async insertNewProducts( user: User ){ 
    await this.productsService.deleAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach( product => {
      insertPromises.push( this.productsService.create( product, user ) );
    });

    await Promise.all( insertPromises );
    return true;
  };
}