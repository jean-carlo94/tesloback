import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, BadRequestException, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';
import { diskStorage } from 'multer';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  //Método 1
  
  @Post('product')
  @UseInterceptors( FileInterceptor('file', { 
    fileFilter: fileFilter,
    limits: { fileSize:500000 },
    storage: diskStorage({
      destination: './static/uploads'
    })
  }) )
  uploadProductImage( @UploadedFile() file: Express.Multer.File ){
    console.log(file);
    
    if( !file ){
      throw new BadRequestException('Make sure that file is an image');
    }
    return { filename: file.originalname };
  }
  
  //Método 2
  /*
  @Post('product')
  @UseInterceptors( FileInterceptor('file') )
  uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500000 }),
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
