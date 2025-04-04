import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from '../database/users/users.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Partial<Record<keyof UserRepository, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    userRepository = {
      findUserByEmail: jest.fn(),
      createUser: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: userRepository },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = {
        email: 'test@example.com',
        name: 'Test',
        password: '123456',
      };

      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);
      (userRepository.createUser as jest.Mock).mockResolvedValue({
        id: 1,
        email: dto.email,
      });

      const result = await service.register(dto);
      expect(result).toEqual({ id: 1, email: dto.email });
      expect(userRepository.createUser).toHaveBeenCalled();
    });

    it('should throw ConflictException if user exists', async () => {
      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue({
        id: 1,
      });

      await expect(
        service.register({
          email: 'existing@example.com',
          name: 'Exists',
          password: 'password',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return access token on correct credentials', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
      };

      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.signAsync as jest.Mock).mockResolvedValue('mocked-token');

      const result = await service.login({
        email: user.email,
        password: 'password',
      });

      expect(result).toEqual({ access_token: 'mocked-token' });
      expect(jwtService.signAsync).toHaveBeenCalledWith({ user_id: user.id });
    });

    it('should throw NotFoundException if user not found', async () => {
      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

      await expect(
        service.login({ email: 'nope@example.com', password: '1234' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
      };

      (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: user.email, password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
