import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDto {
  @ApiProperty({ example: 1, description: 'ID созданного пользователя' })
  id: number;
}
