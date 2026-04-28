import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    
    const validApiKey = this.configService.get<string>('ADMIN_API_KEY');
    
    if (!validApiKey) {
      // No API key configured - allow all requests (dev mode)
      return true;
    }
    
    if (!apiKey) {
      throw new UnauthorizedException('API key required');
    }
    
    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid API key');
    }
    
    return true;
  }
}