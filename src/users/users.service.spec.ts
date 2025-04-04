import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from '../database/users/users.repository';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Partial<Record<keyof UserRepository, jest.Mock>>;

  beforeEach(async () => {
    userRepository = {
      createUser: jest.fn(),
      findUserByEmail: jest.fn(),
      findAllUsers: jest.fn(),
      findUserById: jest.fn(),
      updateUserById: jest.fn(),
      deleteUserById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useValue: userRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('createUser', () => {
    it('should create a user and return id', async () => {
      const userInput = {
        email: 'test@test.com',
        name: 'Test',
        password: '12345678',
      };
      const mockUser = { id: 1, ...userInput, createdAt: new Date() };
      (userRepository.createUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.createUser(userInput);
      expect(result).toEqual({ id: 1 });
      expect(userRepository.createUser).toHaveBeenCalledWith(userInput);
    });
  });

  describe('findUserById', () => {
    it('should return user if found', async () => {
      const mockUser = {
        id: 1,
        email: 'test@test.com',
        name: 'Test',
        createdAt: new Date(),
      };
      (userRepository.findUserById as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findUserById(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw if user not found', async () => {
      (userRepository.findUserById as jest.Mock).mockResolvedValue(null);
      await expect(service.findUserById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllUsers', () => {
    it('should return all users mapped to response format', async () => {
      const mockUsers = [
        {
          id: 1,
          email: 'user1@example.com',
          name: 'User One',
          createdAt: new Date(),
        },
        {
          id: 2,
          email: 'user2@example.com',
          name: 'User Two',
          createdAt: new Date(),
        },
      ];

      (userRepository.findAllUsers as jest.Mock).mockResolvedValue(mockUsers);

      const result = await service.findAllUsers();

      expect(result).toEqual([
        {
          id: mockUsers[0].id,
          email: mockUsers[0].email,
          name: mockUsers[0].name,
          createdAt: mockUsers[0].createdAt,
        },
        {
          id: mockUsers[1].id,
          email: mockUsers[1].email,
          name: mockUsers[1].name,
          createdAt: mockUsers[1].createdAt,
        },
      ]);
    });
  });
  describe('updateUserById', () => {
    it('should update user if exists', async () => {
      const userId = 1;
      const updateData = { name: 'Updated Name' };

      (userRepository.findUserById as jest.Mock).mockResolvedValue({
        id: userId,
        email: 'test@example.com',
        name: 'Old Name',
        createdAt: new Date(),
      });

      const mockUpdate = jest.fn();
      userRepository.updateUserById = mockUpdate;

      await service.updateUserById(userId, updateData);

      expect(userRepository.updateUserById).toHaveBeenCalledWith(
        userId,
        updateData,
      );
    });

    it('should throw NotFoundException if user does not exist', async () => {
      (userRepository.findUserById as jest.Mock).mockResolvedValue(null);

      await expect(service.updateUserById(1, { name: 'Test' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if email already used by another user', async () => {
      const userId = 1;
      const updateData = { email: 'existing@example.com' };

      (userRepository.findUserById as jest.Mock).mockResolvedValue({
        id: userId,
        email: 'old@example.com',
        name: 'Old Name',
        createdAt: new Date(),
      });

      (userRepository.findUserByEmail as jest.Mock) = jest
        .fn()
        .mockResolvedValue({
          id: 2,
          email: 'existing@example.com',
        });

      await expect(service.updateUserById(userId, updateData)).rejects.toThrow(
        ConflictException,
      );
    });
  });
  describe('deleteUserById', () => {
    it('should delete the user if found', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
      };

      (userRepository.findUserById as jest.Mock).mockResolvedValue(mockUser);
      (userRepository.deleteUserById as jest.Mock).mockResolvedValue(undefined);

      await expect(service.deleteUserById(userId)).resolves.toBeUndefined();
      expect(userRepository.findUserById).toHaveBeenCalledWith(userId);
      expect(userRepository.deleteUserById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundException if user not found', async () => {
      (userRepository.findUserById as jest.Mock).mockResolvedValue(null);

      await expect(service.deleteUserById(999)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.deleteUserById).not.toHaveBeenCalled();
    });
  });
});
