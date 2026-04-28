import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  private readonly uploadDir = path.join(process.cwd(), 'uploads');
  private readonly allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  private readonly maxSize = 5 * 1024 * 1024; // 5MB

  constructor(private configService: ConfigService) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string }> {
    if (!file) throw new BadRequestException('No file provided');
    if (!this.allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only jpg, png, webp allowed.');
    }
    if (file.size > this.maxSize) {
      throw new BadRequestException('File too large. Max 5MB allowed.');
    }

    const ext = file.mimetype.split('/')[1];
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join(this.uploadDir, filename);

    fs.writeFileSync(filepath, file.buffer);

    const backendUrl = this.configService.get<string>('app.backendUrl') || 'http://localhost:3001';
    return { url: `${backendUrl}/uploads/${filename}` };
  }
}