import { IdGenerator } from '../utils/id-generator';

export const SAMPLE_USERS = [
  {
    name: 'John Doe',
    email: 'john@example.com',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
  },
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
  },
  {
    name: 'Bob Wilson',
    email: 'bob@example.com',
  },
] as const;

export function generateSampleUsers() {
  const now = new Date().toISOString();

  return SAMPLE_USERS.map(userData => ({
    id: IdGenerator.generateUUID(),
    name: userData.name,
    email: userData.email,
    createdAt: now,
    updatedAt: now,
  }));
}
