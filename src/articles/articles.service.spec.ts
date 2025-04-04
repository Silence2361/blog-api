import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { ArticleRepository } from '../database/articles/articles.repository';
import { UserRepository } from '../database/users/users.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';
import Redis from 'ioredis';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let articleRepository: Partial<Record<keyof ArticleRepository, jest.Mock>>;
  let userRepository: Partial<Record<keyof UserRepository, jest.Mock>>;
  let redisClient: Partial<Redis>;

  beforeEach(async () => {
    articleRepository = {
      findArticleByTitle: jest.fn(),
      createArticle: jest.fn(),
      findArticleById: jest.fn(),
      findAllPaginated: jest.fn(),
      updateArticleById: jest.fn(),
      deleteArticleById: jest.fn(),
    };

    userRepository = {
      findUserById: jest.fn(),
    };

    redisClient = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      keys: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticlesService,
        { provide: ArticleRepository, useValue: articleRepository },
        { provide: UserRepository, useValue: userRepository },
        { provide: 'REDIS_CLIENT', useValue: redisClient },
      ],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
  });

  describe('createArticle', () => {
    it('should create a new article', async () => {
      const mockUser = {
        id: 1,
        email: 'user@example.com',
        name: 'Test',
        createdAt: new Date(),
      };

      const articleDto = {
        title: 'Test article',
        description: 'Test content',
      };

      (userRepository.findUserById as jest.Mock).mockResolvedValue(mockUser);
      (articleRepository.findArticleByTitle as jest.Mock).mockResolvedValue(
        null,
      );
      (articleRepository.createArticle as jest.Mock).mockResolvedValue({
        id: 123,
      });

      const result = await service.createArticle(articleDto, mockUser.id);
      expect(result).toEqual({ id: 123 });
      expect(articleRepository.createArticle).toHaveBeenCalled();
    });

    it('should throw if user not found', async () => {
      (userRepository.findUserById as jest.Mock).mockResolvedValue(null);

      await expect(
        service.createArticle({ title: 'Test', description: 'desc' }, 99),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw if article title already exists', async () => {
      const mockUser = { id: 1, name: 'Test', email: 'test@example.com' };
      (userRepository.findUserById as jest.Mock).mockResolvedValue(mockUser);
      (articleRepository.findArticleByTitle as jest.Mock).mockResolvedValue({
        id: 10,
      });

      await expect(
        service.createArticle({ title: 'Test', description: 'desc' }, 1),
      ).rejects.toThrow(ConflictException);
    });
  });
  describe('findArticleById', () => {
    it('should return cached article if found in Redis', async () => {
      const cachedData = JSON.stringify({
        id: 1,
        title: 'Cached article',
        description: 'Cached description',
        publishedAt: new Date(),
        author: {
          id: 1,
          email: 'user@example.com',
          name: 'User',
          createdAt: new Date(),
        },
      });

      (redisClient.get as jest.Mock).mockResolvedValue(cachedData);

      const result = await service.findArticleById(1);
      expect(redisClient.get).toHaveBeenCalledWith('article:1');
      expect(result?.title).toBe('Cached article');
    });

    it('should query DB if cache is empty and cache the result', async () => {
      const mockArticle = {
        id: 1,
        title: 'Article DB',
        description: 'Description',
        publishedAt: new Date(),
        author: {
          id: 2,
          email: 'user@example.com',
          name: 'Test User',
          createdAt: new Date(),
        },
      };

      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (articleRepository.findArticleById as jest.Mock).mockResolvedValue(
        mockArticle,
      );

      const result = await service.findArticleById(1);
      expect(articleRepository.findArticleById).toHaveBeenCalledWith(1);
      expect(redisClient.set).toHaveBeenCalledWith(
        'article:1',
        expect.any(String),
        'EX',
        10,
      );
      expect(result?.title).toBe('Article DB');
    });

    it('should throw NotFoundException if article not found', async () => {
      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (articleRepository.findArticleById as jest.Mock).mockResolvedValue(null);

      await expect(service.findArticleById(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAllArticles', () => {
    it('should return cached articles if present in Redis', async () => {
      const query = { page: 1, limit: 10 };
      const cacheKey = `articles:${JSON.stringify(query)}`;

      const cachedResult = {
        items: [
          {
            id: 1,
            title: 'Cached',
            description: 'desc',
            publishedAt: new Date(),
            author: {
              id: 1,
              email: 'u@mail.com',
              name: 'Name',
              createdAt: new Date(),
            },
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        hasNextPage: false,
      };

      (redisClient.get as jest.Mock).mockResolvedValue(
        JSON.stringify(cachedResult),
      );

      const result = await service.findAllArticles(query);

      expect(redisClient.get).toHaveBeenCalledWith(cacheKey);
      expect(result.total).toBe(1);
      expect(result.items[0].title).toBe('Cached');
    });

    it('should query DB and cache result if not in Redis', async () => {
      const query = { page: 1, limit: 10 };
      const cacheKey = `articles:${JSON.stringify(query)}`;

      const dbResult = {
        items: [
          {
            id: 2,
            title: 'From DB',
            description: 'desc',
            publishedAt: new Date(),
            author: {
              id: 2,
              email: 'u2@mail.com',
              name: 'U2',
              createdAt: new Date(),
            },
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        hasNextPage: false,
      };

      (redisClient.get as jest.Mock).mockResolvedValue(null);
      (articleRepository.findAllPaginated as jest.Mock).mockResolvedValue(
        dbResult,
      );

      const result = await service.findAllArticles(query);

      expect(articleRepository.findAllPaginated).toHaveBeenCalledWith(query);
      expect(redisClient.set).toHaveBeenCalledWith(
        cacheKey,
        expect.any(String),
        'EX',
        10,
      );
      expect(result.items[0].title).toBe('From DB');
    });
  });
  describe('updateArticleById', () => {
    it('should update the article if it exists', async () => {
      const mockArticle = { id: 1 };
      (articleRepository.findArticleById as jest.Mock).mockResolvedValue(
        mockArticle,
      );
      (articleRepository.updateArticleById as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(
        service.updateArticleById(1, { title: 'Updated Title' }),
      ).resolves.toBeUndefined();

      expect(articleRepository.updateArticleById).toHaveBeenCalledWith(1, {
        title: 'Updated Title',
      });
    });

    it('should throw NotFoundException if article does not exist', async () => {
      (articleRepository.findArticleById as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateArticleById(99, { title: 'Updated Title' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteArticleById', () => {
    it('should delete the article if it exists', async () => {
      const mockArticle = { id: 1 };
      (articleRepository.findArticleById as jest.Mock).mockResolvedValue(
        mockArticle,
      );
      (articleRepository.deleteArticleById as jest.Mock).mockResolvedValue(
        undefined,
      );

      await expect(service.deleteArticleById(1)).resolves.toBeUndefined();
      expect(articleRepository.deleteArticleById).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if article does not exist', async () => {
      (articleRepository.findArticleById as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteArticleById(99)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
