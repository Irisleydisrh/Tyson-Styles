import { Expose, Exclude } from 'class-transformer';
import { IsEnum, IsString } from 'class-validator';

export class UserResponseDto {
  @Expose() id: string;
  @Expose() email: string;
  @Expose() name: string | null;
  @Expose() phone: string | null;
  @Expose() role: string;
  @Expose() createdAt: Date;

  @Exclude()
  password: string;
}

export class UpdateRoleDto {
  @IsEnum(['ADMIN', 'USER'])
  @IsString()
  role: 'ADMIN' | 'USER';
}