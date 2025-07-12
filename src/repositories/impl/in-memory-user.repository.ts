import { User, CreateUserRequest, UpdateUserRequest } from '../../types';
import { UserRepository } from '../user.repository';
import { IdGenerator } from '../../utils/id-generator';
import { generateSampleUsers } from '../../config/sample-data';

export class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];

  constructor() {
    // Initialize with sample data
    this.users = generateSampleUsers();
  }

  async findAll(): Promise<User[]> {
    return [...this.users];
  }

  async findById(id: string): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    return user || null;
  }

  async create(userData: CreateUserRequest): Promise<User> {
    const now = new Date().toISOString();
    const newUser: User = {
      id: IdGenerator.generateUUID(),
      name: userData.name,
      email: userData.email,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(newUser);
    return newUser;
  }

  async update(id: string, userData: UpdateUserRequest): Promise<User | null> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return null;
    }

    const currentUser = this.users[userIndex]!;
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

  async delete(id: string): Promise<boolean> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    return true;
  }

  async findPaginated(
    page: number,
    limit: number
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

  async exists(id: string): Promise<boolean> {
    return this.users.some(u => u.id === id);
  }

  async emailExists(email: string, excludeId?: string): Promise<boolean> {
    return this.users.some(u => u.email === email && u.id !== excludeId);
  }
}
