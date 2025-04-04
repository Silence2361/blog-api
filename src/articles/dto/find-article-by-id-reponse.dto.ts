import { ApiProperty } from '@nestjs/swagger';

export class FindArticleByIdResponseDto {
  @ApiProperty({ example: 1, description: 'ID статьи' })
  id: number;

  @ApiProperty({ example: 'Заголовок статьи', description: 'Заголовок статьи' })
  title: string;

  @ApiProperty({ example: 'Описание статьи', description: 'Описание статьи' })
  description: string;

  @ApiProperty({
    example: '2025-04-04T12:00:00Z',
    description: 'Дата публикации статьи',
  })
  publishedAt: Date;
}
