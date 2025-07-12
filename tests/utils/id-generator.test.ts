import { describe, it, expect } from 'vitest';
import { IdGenerator } from '../../src/utils/id-generator';

describe('ID Generator Utils', () => {
  describe('generateId', () => {
    it('should generate a hex string', () => {
      const id = IdGenerator.generateId();

      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(id).toMatch(/^[0-9a-f]{32}$/); // 32 hex characters
    });

    it('should generate unique IDs', () => {
      const id1 = IdGenerator.generateId();
      const id2 = IdGenerator.generateId();

      expect(id1).not.toBe(id2);
    });
  });

  describe('generateUUID', () => {
    it('should generate a valid UUID v4', () => {
      const uuid = IdGenerator.generateUUID();

      expect(uuid).toBeDefined();
      expect(typeof uuid).toBe('string');
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = IdGenerator.generateUUID();
      const uuid2 = IdGenerator.generateUUID();

      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('generateNanoId', () => {
    it('should generate a nano ID with default length', () => {
      const nanoId = IdGenerator.generateNanoId();

      expect(nanoId).toBeDefined();
      expect(typeof nanoId).toBe('string');
      expect(nanoId.length).toBe(12); // Default length in implementation
    });

    it('should generate a nano ID with custom length', () => {
      const customLength = 10;
      const nanoId = IdGenerator.generateNanoId(customLength);

      expect(nanoId).toBeDefined();
      expect(typeof nanoId).toBe('string');
      expect(nanoId.length).toBe(customLength);
    });

    it('should generate unique nano IDs', () => {
      const id1 = IdGenerator.generateNanoId();
      const id2 = IdGenerator.generateNanoId();

      expect(id1).not.toBe(id2);
    });

    it('should only contain valid characters', () => {
      const nanoId = IdGenerator.generateNanoId();

      // Uses alphanumeric characters
      expect(nanoId).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('should handle different sizes', () => {
      const sizes = [1, 5, 20, 50];

      sizes.forEach(size => {
        const nanoId = IdGenerator.generateNanoId(size);
        expect(nanoId.length).toBe(size);
      });
    });
  });
});
