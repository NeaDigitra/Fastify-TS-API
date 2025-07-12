import { User, CreateUserRequest, UpdateUserRequest } from '../types';
import { NotFoundError, DuplicateResourceError } from '../utils/errors';
import { UserRepository } from '../repositories/user.repository';
import { InMemoryUserRepository } from '../repositories/impl/in-memory-user.repository';
import { MESSAGES, interpolateMessage } from '../config/messages';
import { API_CONSTANTS } from '../config/constants';
import { env } from '../config';

export class UserService {
  private userRepository: UserRepository;
  private messages: typeof MESSAGES;
  private constants: typeof API_CONSTANTS;

  constructor({
    userRepository,
    messages,
    constants,
  }: {
    userRepository?: UserRepository;
    messages?: typeof MESSAGES;
    constants?: typeof API_CONSTANTS;
  } = {}) {
    this.userRepository = userRepository || new InMemoryUserRepository();
    this.messages = messages || MESSAGES;
    this.constants = constants || API_CONSTANTS;
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError(
        interpolateMessage(this.messages.ERROR.USER_NOT_FOUND, { id })
      );
    }
    return user;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const emailExists = await this.userRepository.emailExists(userData.email);
    if (emailExists) {
      throw new DuplicateResourceError(this.messages.ERROR.USER_EMAIL_EXISTS);
    }

    return this.userRepository.create(userData);
  }

  async updateUser(id: string, userData: UpdateUserRequest): Promise<User> {
    const userExists = await this.userRepository.exists(id);
    if (!userExists) {
      throw new NotFoundError(
        interpolateMessage(this.messages.ERROR.USER_NOT_FOUND, { id })
      );
    }

    if (userData.email) {
      const emailExists = await this.userRepository.emailExists(
        userData.email,
        id
      );
      if (emailExists) {
        throw new DuplicateResourceError(this.messages.ERROR.USER_EMAIL_EXISTS);
      }
    }

    const updatedUser = await this.userRepository.update(id, userData);
    if (!updatedUser) {
      throw new NotFoundError(
        interpolateMessage(this.messages.ERROR.USER_NOT_FOUND, { id })
      );
    }

    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundError(
        interpolateMessage(this.messages.ERROR.USER_NOT_FOUND, { id })
      );
    }
  }

  async getUsersPaginated(
    page: number = env.PAGINATION_DEFAULT_PAGE,
    limit: number = env.PAGINATION_DEFAULT_LIMIT
  ): Promise<{
    users: User[];
    total: number;
  }> {
    // Enforce maximum limit
    const effectiveLimit = Math.min(limit, env.PAGINATION_MAX_LIMIT);

    return this.userRepository.findPaginated(page, effectiveLimit);
  }
}
