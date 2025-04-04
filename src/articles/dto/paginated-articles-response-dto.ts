import { ApiProperty } from '@nestjs/swagger';
import { FindAllArticlesResponseDto } from './find-all-articles-response-dto';
import { FindArticleByIdResponseDto } from './find-article-by-id-reponse.dto';

export class PaginatedArticlesResponseDto {
  @ApiProperty({
    type: [FindArticleByIdResponseDto],
    description: 'Список статей',
  })
  items: FindAllArticlesResponseDto[];

  @ApiProperty({ example: 20, description: 'Общее количество статей' })
  total: number;

  @ApiProperty({ example: 1, description: 'Текущая страница' })
  page: number;

  @ApiProperty({ example: 10, description: 'Количество статей на страницу' })
  limit: number;

  @ApiProperty({ example: true, description: 'Есть ли следующая страница' })
  hasNextPage: boolean;
}
