import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ example: 'Название статьи', description: 'Заголовок' })
  // @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @ApiProperty({ example: 'Описание статьи', description: 'Описание' })
  // @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  description: string;
}
