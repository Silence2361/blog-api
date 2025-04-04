import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleResponseDto } from './dto/create-article-response-dto';
import { CreateArticleDto } from './dto/create-article-dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { FindArticleByIdResponseDto } from './dto/find-article-by-id-reponse.dto';
import { PaginatedArticlesResponseDto } from './dto/paginated-articles-response-dto';
import { FindArticlesQueryDto } from './dto/find-articles-query-dto';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/user-id.decorator';
import { JwtPayload } from '../jwt/jwt.payload';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Articles')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiOperation({ summary: 'Создание статьи' })
  @ApiResponse({ status: 201, type: CreateArticleResponseDto })
  @ApiResponse({
    status: 409,
    description: 'Статья с таким названием уже существует',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createArticle(
    @Body() article: CreateArticleDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<CreateArticleResponseDto> {
    return this.articlesService.createArticle(article, user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Получение списка статей с пагинацией и фильтрами' })
  @ApiResponse({ status: 200, type: PaginatedArticlesResponseDto })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({
    name: 'publishedAfter',
    required: false,
    example: '2025-01-01T00:00:00Z',
  })
  @ApiQuery({
    name: 'publishedBefore',
    required: false,
    example: '2025-12-31T23:59:59Z',
  })
  @ApiQuery({ name: 'authorId', required: false, example: 1 })
  async findAllArticles(
    @Query() query: FindArticlesQueryDto,
  ): Promise<PaginatedArticlesResponseDto> {
    return this.articlesService.findAllArticles(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение статьи по ID' })
  @ApiResponse({ status: 200, type: FindArticleByIdResponseDto })
  @ApiResponse({ status: 404, description: 'Статья не найдена' })
  @ApiParam({ name: 'id', description: 'ID статьи', example: 1 })
  async findArticleById(
    @Param('id') id: number,
  ): Promise<FindArticleByIdResponseDto | null> {
    return this.articlesService.findArticleById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновление статьи по ID' })
  @ApiResponse({ status: 200, description: 'Статья успешно обновлена' })
  @ApiResponse({ status: 404, description: 'Статья не найдена' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: 'ID статьи', example: 1 })
  async updateArticleById(
    @Param('id') id: number,
    @Body() article: UpdateArticleDto,
  ): Promise<void> {
    return this.articlesService.updateArticleById(id, article);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление статьи по ID' })
  @ApiResponse({ status: 200, description: 'Статья успешно удалена' })
  @ApiResponse({ status: 404, description: 'Статья не найдена' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'id', description: 'ID статьи', example: 1 })
  async deleteArticleById(@Param('id') id: number): Promise<void> {
    return this.articlesService.deleteArticleById(id);
  }
}
