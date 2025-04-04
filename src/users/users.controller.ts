import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import { CreateUserResponseDto } from './dto/create-user-response-dto';
import { FindAllUsersResponseDto } from './dto/find-all-users-response-dto';
import { FindUserByIdResponseDto } from './dto/find-user-by-id-response-dto';
import { UpdateUserByIdResponseDto } from './dto/update-user-by-id-response-dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../jwt/jwt-auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь создан',
    type: CreateUserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует',
  })
  @ApiBody({ type: CreateUserDto })
  async createUser(
    @Body() user: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    return this.usersService.createUser(user);
  }

  @Get()
  @ApiOperation({ summary: 'Получить список всех пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей',
    type: [FindAllUsersResponseDto],
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findAllUsers(): Promise<FindAllUsersResponseDto[]> {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Пользователь найден',
    type: FindUserByIdResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async findUserById(
    @Param('id') id: number,
  ): Promise<FindUserByIdResponseDto> {
    return this.usersService.findUserById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить пользователя по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserByIdResponseDto })
  @ApiResponse({ status: 200, description: 'Пользователь обновлен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async updateUserById(
    @Param('id') id: number,
    @Body() user: UpdateUserByIdResponseDto,
  ): Promise<void> {
    return this.usersService.updateUserById(id, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя по ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Пользователь удален' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteUserById(@Param('id') id: number): Promise<void> {
    return this.usersService.deleteUserById(id);
  }
}
