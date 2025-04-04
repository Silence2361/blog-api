import { ApiProperty } from '@nestjs/swagger';

export class RegistrationResponseDto {
  @ApiProperty({ example: 1, description: 'ID  пользователя' })
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email пользователя',
  })
  email: string;
}
