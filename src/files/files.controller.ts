import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) { }

  @Get(':type/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('type') type: string,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage(imageName, type);

    res.status(200).sendFile(path);

  }

  @Post('products')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductImage(
    @UploadedFile() file: Express.Multer.File
  ) {

    if (!file) throw new BadRequestException('File not found');

    const secureUrl = `${this.configService.get('HOST_API')}/files/products/${file.filename}`

    return {
      secureUrl,
    };
  }

}
