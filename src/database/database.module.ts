import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { UserRepository } from './users/users.repository';
import { Article } from './articles/articles.entity';
import { ArticleRepository } from './articles/articles.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, Article])],
  providers: [UserRepository, ArticleRepository],
  exports: [UserRepository, ArticleRepository],
})
export class DatabaseModule {}
