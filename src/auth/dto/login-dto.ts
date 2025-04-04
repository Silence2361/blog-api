import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Пароль пользователя',
  })
  @IsString()
  password: string;
}
