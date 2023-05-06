import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

import { diskStorage } from 'multer';
import { Response } from 'express';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage( imageName );
    res.sendFile( path );
  };
  
  //Método 1
  @Post('product')
  @UseInterceptors( FileInterceptor('file', { 
    fileFilter: fileFilter,
    limits: { fileSize:500000 },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductImage( @UploadedFile() file: Express.Multer.File ){

    if( !file ) throw new BadRequestException('Make sure that file is an image');    
    const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`;
    return { secureUrl };
  };
  
  //Método 2
  /*
  @Post('product')
  uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100000 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|jpg|png|gif)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ){
    
    return { filename: file.originalname };
  }
  */
}
