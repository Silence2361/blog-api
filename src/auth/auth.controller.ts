import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDto } from './dto/registration-dto';
import { IRegistrationResponse } from 'src/database/auth/auth.interface';
import { LoginDto } from './dto/login-dto';
import { LoginResponseDto } from './dto/login-response-dto';
import {
  ApiBadRequestResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    type: RegistrationDto,
  })
  @ApiBadRequestResponse({
    description: 'Некорректные данные или email уже занят',
  })
  async registration(
    @Body() registrationDto: RegistrationDto,
  ): Promise<IRegistrationResponse> {
    return this.authService.register(registrationDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Аутентификация пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход, возвращает JWT токен',
    type: LoginResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Неверный email или пароль' })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }
}
