import { Article } from './articles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import {
  IArticle,
  ICreateArticle,
  IFindArticlesQuery,
  IUpdateArticle,
  IPaginatedResult,
} from './articles.interface';

export class ArticleRepository {
  constructor(
    @InjectRepository(Article) private articlesRepository: Repository<Article>,
  ) {}

  async createArticle(article: ICreateArticle): Promise<IArticle> {
    const newArticle = this.articlesRepository.create(article);
    return this.articlesRepository.save(newArticle);
  }

  async findArticleById(articleId: number): Promise<IArticle | null> {
    return this.articlesRepository.findOne({ where: { id: articleId } });
  }

  async findArticleByTitle(title: string): Promise<IArticle | null> {
    return this.articlesRepository.findOne({ where: { title } });
  }

  async findAllPaginated(
    query: IFindArticlesQuery,
  ): Promise<IPaginatedResult<IArticle>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.publishedAfter) {
      where.publishedAt = MoreThanOrEqual(new Date(query.publishedAfter));
    }
    if (query.publishedBefore) {
      where.publishedAt = LessThanOrEqual(new Date(query.publishedBefore));
    }
    if (query.authorId) {
      where.author = { id: query.authorId };
    }

    const [items, total] = await this.articlesRepository.findAndCount({
      where,
      relations: ['author'],
      order: { publishedAt: 'DESC' },
      skip,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      hasNextPage: page * limit < total,
    };
  }

  async updateArticleById(
    articleId: number,
    article: IUpdateArticle,
  ): Promise<void> {
    await this.articlesRepository.update({ id: articleId }, article);
  }

  async deleteArticleById(articleId: number): Promise<void> {
    await this.articlesRepository.delete({ id: articleId });
  }
}
