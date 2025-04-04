import { ApiProperty } from '@nestjs/swagger';

export class FindUserByIdResponseDto {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  id: number;

  @ApiProperty({
    example: 'test@example.com',
    description: 'Email пользователя',
  })
  email: string;

  @ApiProperty({ example: 'Имя', description: 'Имя пользователя' })
  name: string;

  @ApiProperty({
    example: '2025-04-01T12:00:00Z',
    description: 'Дата создания пользователя',
  })
  createdAt: Date;
}
