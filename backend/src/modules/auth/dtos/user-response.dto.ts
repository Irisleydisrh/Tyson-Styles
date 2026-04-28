import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  name: string | null;

  @Expose()
  phone: string | null;

  @Expose()
  role: string;

  @Expose()
  createdAt: Date;

  @Exclude()
  password: string;
}