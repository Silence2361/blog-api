import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegistrationDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  @IsEmail()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: 'Имя', description: 'Имя пользователя' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(16)
  name: string;

  @ApiProperty({
    example: 'securePassword123',
    description: 'Пароль пользователя',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(28)
  password: string;
}
