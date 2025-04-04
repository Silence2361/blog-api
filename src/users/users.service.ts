import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ICreateUser,
  ICreateUserResponse,
  IFindAllUsersResponse,
  IFindUserByIdResponse,
  IUpdateUser,
} from '../database/users/users.interface';
import { UserRepository } from '../database/users/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(user: ICreateUser): Promise<ICreateUserResponse> {
    const existingUser = await this.userRepository.findUserByEmail(user.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const newUser = await this.userRepository.createUser(user);
    return { id: newUser.id };
  }

  async findAllUsers(): Promise<IFindAllUsersResponse[]> {
    const users = await this.userRepository.findAllUsers();

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    }));
  }

  async findUserById(userId: number): Promise<IFindUserByIdResponse> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }

  async updateUserById(userId: number, userData: IUpdateUser): Promise<void> {
    const existingUser = await this.userRepository.findUserById(userId);

    if (!existingUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (userData.email && userData.email !== existingUser.email) {
      const other = await this.userRepository.findUserByEmail(userData.email);
      if (other && other.id !== userId) {
        throw new ConflictException('Email already in use');
      }
    }

    await this.userRepository.updateUserById(userId, userData);
  }

  async deleteUserById(userId: number): Promise<void> {
    const existingUser = await this.userRepository.findUserById(userId);

    if (!existingUser) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    await this.userRepository.deleteUserById(userId);
  }
}
