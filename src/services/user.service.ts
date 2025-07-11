import { User, CreateUserRequest, UpdateUserRequest } from '../types';
import { NotFoundError, DuplicateResourceError } from '../utils/errors';
import { IdGenerator } from '../utils/id-generator';

export class UserService {
  private users: User[] = [
    {
      id: IdGenerator.generateUUID(),
      name: 'John Doe',
      email: 'john@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: IdGenerator.generateUUID(),
      name: 'Jane Smith',
      email: 'jane@example.com',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(id: string): Promise<User> {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      throw new NotFoundError(`User with id ${id} not found`);
    }
    return user;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new DuplicateResourceError('User with this email already exists');
    }

    const newUser: User = {
      id: IdGenerator.generateUUID(),
      name: userData.name,
      email: userData.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    const currentUser = this.users[userIndex]!;

    if (userData.email) {
      const existingUser = this.users.find(
        u => u.email === userData.email && u.id !== id
      );
      if (existingUser) {
        throw new DuplicateResourceError('User with this email already exists');
      }
    }

    const updatedUser: User = {
      id: currentUser.id,
      name: userData.name ?? currentUser.name,
      email: userData.email ?? currentUser.email,
      createdAt: currentUser.createdAt,
      updatedAt: new Date().toISOString(),
    };

    this.users[userIndex] = updatedUser;
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundError(`User with id ${id} not found`);
    }

    this.users.splice(userIndex, 1);
  }

  async getUsersPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<{
    users: User[];
    total: number;
  }> {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      users: this.users.slice(startIndex, endIndex),
      total: this.users.length,
    };
  }
}
