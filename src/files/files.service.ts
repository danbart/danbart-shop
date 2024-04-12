import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {

    getStaticProductImage(imageName: string, type: string) {
        const path = join(__dirname, '..', '..', 'static', type, imageName);
        if (!existsSync(path))
            throw new BadRequestException('File not found with image name provided');
        return path
    }

}
