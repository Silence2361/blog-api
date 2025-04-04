import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { ICreateUser, IUpdateUser, IUser } from './users.interface';

export class UserRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(user: ICreateUser): Promise<IUser> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async findAllUsers(): Promise<IUser[]> {
    return this.userRepository.find();
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findUserById(id: number): Promise<IUser | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUserById(id: number, user: IUpdateUser): Promise<void> {
    await this.userRepository.update({ id }, user);
  }

  async deleteUserById(id: number): Promise<void> {
    await this.userRepository.delete({ id });
  }
}
