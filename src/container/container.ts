import {
  createContainer,
  asClass,
  asValue,
  InjectionMode,
  AwilixContainer,
} from 'awilix';
import { UserService } from '../services/user.service';
import { HealthController } from '../controllers/health.controller';
import { UserController } from '../controllers/user.controller';
import { UserRepository } from '../repositories/user.repository';
import { InMemoryUserRepository } from '../repositories/impl/in-memory-user.repository';
import { API_CONSTANTS } from '../config/constants';
import { MESSAGES } from '../config/messages';

export interface Container {
  userRepository: UserRepository;
  userService: UserService;
  userController: UserController;
  healthController: HealthController;
  constants: typeof API_CONSTANTS;
  messages: typeof MESSAGES;
}

export function createDIContainer(): AwilixContainer<Container> {
  const container = createContainer<Container>({
    injectionMode: InjectionMode.CLASSIC,
  });

  // Register constants and config
  container.register({
    constants: asValue(API_CONSTANTS),
    messages: asValue(MESSAGES),
  });

  // Register repositories
  container.register({
    userRepository: asClass(InMemoryUserRepository).singleton(),
  });

  // Register services
  container.register({
    userService: asClass(UserService).singleton(),
  });

  // Register controllers
  container.register({
    userController: asClass(UserController).singleton(),
    healthController: asClass(HealthController).singleton(),
  });

  return container;
}
