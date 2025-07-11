import { randomBytes } from 'crypto';

export class IdGenerator {
  static generateId(): string {
    return randomBytes(16).toString('hex');
  }

  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  static generateNanoId(size: number = 12): string {
    const alphabet =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let id = '';
    for (let i = 0; i < size; i++) {
      id += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    return id;
  }
}
