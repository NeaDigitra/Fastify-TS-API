import { User, CreateUserRequest, UpdateUserRequest } from '../types';

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: CreateUserRequest): Promise<User>;
  update(id: string, userData: UpdateUserRequest): Promise<User | null>;
  delete(id: string): Promise<boolean>;
  findPaginated(
    page: number,
    limit: number
  ): Promise<{
    users: User[];
    total: number;
  }>;
  exists(id: string): Promise<boolean>;
  emailExists(email: string, excludeId?: string): Promise<boolean>;
}
