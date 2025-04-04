import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleResponseDto {
  @ApiProperty({ example: 1, description: 'ID созданной статьи' })
  id: number;
}
