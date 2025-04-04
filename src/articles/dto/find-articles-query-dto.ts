import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class FindArticlesQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Номер страницы пагинации' })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Количество статей на страницу',
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number = 10;

  @ApiPropertyOptional({
    example: '2025-01-01T00:00:00Z',
    description: 'Фильтр по дате публикации после',
  })
  @IsOptional()
  @Type(() => String)
  publishedAfter?: string;

  @ApiPropertyOptional({
    example: '2025-12-31T23:59:59Z',
    description: 'Фильтр по дате публикации до',
  })
  @IsOptional()
  @Type(() => String)
  publishedBefore?: string;

  @ApiPropertyOptional({ example: 3, description: 'ID автора для фильтрации' })
  @IsOptional()
  @Type(() => Number)
  authorId?: number;
}
