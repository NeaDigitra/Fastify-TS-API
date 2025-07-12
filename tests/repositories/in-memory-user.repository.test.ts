import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryUserRepository } from '../../src/repositories/impl/in-memory-user.repository';

describe('InMemoryUserRepository Edge Cases', () => {
  let repository: InMemoryUserRepository;

  beforeEach(() => {
    repository = new InMemoryUserRepository();
  });

  describe('findAll defensive copy', () => {
    it('should return a copy of users array, not a reference', async () => {
      const user = {
        name: 'Test User',
        email: 'test@example.com',
      };

      await repository.create(user);

      const users1 = await repository.findAll();
      const users2 = await repository.findAll();

      // Should be different array instances (defensive copy)
      expect(users1).not.toBe(users2);

      // But should have the same content
      expect(users1).toEqual(users2);

      // Modifying returned array should not affect internal state
      users1.push({
        id: '2',
        name: 'Modified User',
        email: 'modified@example.com',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      const users3 = await repository.findAll();
      expect(users3.length).toBeGreaterThan(1); // Has initial sample data plus new user
    });
  });

  describe('findByEmail null case', () => {
    it('should return null when email is not found', async () => {
      const result = await repository.findByEmail('nonexistent@example.com');
      expect(result).toBeNull();
    });

    it('should return null for empty email', async () => {
      const result = await repository.findByEmail('');
      expect(result).toBeNull();
    });

    it('should handle case sensitivity', async () => {
      const user = {
        name: 'Test User',
        email: 'test@example.com',
      };

      await repository.create(user);

      const result = await repository.findByEmail('TEST@EXAMPLE.COM');
      expect(result).toBeNull(); // Case sensitive search
    });
  });

  describe('update user not found', () => {
    it('should return null when user ID does not exist during update', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const result = await repository.update('non-existent-id', updateData);
      expect(result).toBeNull();
    });

    it('should return null when trying to update with empty ID', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const result = await repository.update('', updateData);
      expect(result).toBeNull();
    });
  });

  describe('comprehensive repository functionality', () => {
    it('should handle complete CRUD operations', async () => {
      // Create
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
      };

      const created = await repository.create(userData);
      expect(created.name).toBe('Test User');
      expect(created.email).toBe('test@example.com');

      // Read
      const found = await repository.findById(created.id);
      expect(found).toEqual(created);

      const foundByEmail = await repository.findByEmail('test@example.com');
      expect(foundByEmail).toEqual(created);

      // Update
      const updateData = {
        name: 'Updated User',
        email: 'updated@example.com',
      };

      // Add small delay to ensure timestamp difference
      await new Promise(resolve => globalThis.setTimeout(resolve, 1));

      const updated = await repository.update(created.id, updateData);
      expect(updated).toBeDefined();
      expect(updated?.name).toBe('Updated User');
      expect(updated?.email).toBe('updated@example.com');
      expect(updated?.updatedAt).not.toBe(created.updatedAt);

      // Delete
      const deleted = await repository.delete(created.id);
      expect(deleted).toBe(true);

      const notFound = await repository.findById(created.id);
      expect(notFound).toBeNull();
    });

    it('should handle delete of non-existent user', async () => {
      const result = await repository.delete('non-existent');
      expect(result).toBe(false);
    });

    it('should maintain proper data integrity', async () => {
      const initialUsers = await repository.findAll();
      const initialCount = initialUsers.length;

      const user1 = {
        name: 'User 1',
        email: 'user1@example.com',
      };

      const user2 = {
        name: 'User 2',
        email: 'user2@example.com',
      };

      const created1 = await repository.create(user1);
      const created2 = await repository.create(user2);

      const allUsers = await repository.findAll();
      expect(allUsers).toHaveLength(initialCount + 2);

      // Delete one user
      await repository.delete(created1.id);

      const remainingUsers = await repository.findAll();
      expect(remainingUsers).toHaveLength(initialCount + 1);
      expect(remainingUsers.find(u => u.id === created2.id)).toBeDefined();
    });
  });
});
