import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '../../src/services/user.service';
import { UserRepository } from '../../src/repositories/user.repository';
import { NotFoundError, DuplicateResourceError } from '../../src/utils/errors';
import { User } from '../../src/types';
import { MESSAGES } from '../../src/config/messages';
import { API_CONSTANTS } from '../../src/config/constants';

describe('UserService Error Scenarios', () => {
  let userService: UserService;
  let mockRepository: Partial<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      findByEmail: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findPaginated: vi.fn(),
      exists: vi.fn(),
      emailExists: vi.fn(),
    };
    userService = new UserService({
      userRepository: mockRepository as UserRepository,
      messages: MESSAGES,
      constants: API_CONSTANTS,
    });
  });

  describe('getAllUsers error handling', () => {
    it('should throw error when repository.findAll fails', async () => {
      const repositoryError = new Error('Database connection failed');
      mockRepository.findAll = vi.fn().mockRejectedValue(repositoryError);

      await expect(userService.getAllUsers()).rejects.toThrow(
        'Database connection failed'
      );
    });
  });

  describe('updateUser error scenarios', () => {
    const updateData = {
      name: 'Jane Doe',
      email: 'jane@example.com',
    };

    it('should throw DuplicateResourceError when email conflict occurs during update', async () => {
      mockRepository.exists = vi.fn().mockResolvedValue(true);
      mockRepository.emailExists = vi.fn().mockResolvedValue(true);

      await expect(userService.updateUser('123', updateData)).rejects.toThrow(
        DuplicateResourceError
      );
      await expect(userService.updateUser('123', updateData)).rejects.toThrow(
        'User with this email already exists'
      );
    });

    it('should throw NotFoundError when repository.update returns null', async () => {
      mockRepository.exists = vi.fn().mockResolvedValue(true);
      mockRepository.emailExists = vi.fn().mockResolvedValue(false);
      mockRepository.update = vi.fn().mockResolvedValue(null);

      await expect(userService.updateUser('123', updateData)).rejects.toThrow(
        NotFoundError
      );
      await expect(userService.updateUser('123', updateData)).rejects.toThrow(
        'User with id 123 not found'
      );
    });
  });

  describe('existing functionality coverage', () => {
    it('should handle user creation successfully', async () => {
      const newUser: User = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      mockRepository.emailExists = vi.fn().mockResolvedValue(false);
      mockRepository.create = vi.fn().mockResolvedValue(newUser);

      const result = await userService.createUser({
        name: 'John Doe',
        email: 'john@example.com',
      });

      expect(result).toEqual(newUser);
    });

    it('should delete user successfully', async () => {
      mockRepository.delete = vi.fn().mockResolvedValue(true);

      await expect(userService.deleteUser('123')).resolves.toBeUndefined();
    });
  });
});
