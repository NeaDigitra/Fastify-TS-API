import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/user.service';
import { ResponseUtil } from '../utils/response';
import { CreateUserRequest, UpdateUserRequest } from '../types';
import { MESSAGES } from '../config/messages';
import { API_CONSTANTS } from '../config/constants';
import { env } from '../config';

export class UserController {
  private userService: UserService;
  private readonly messagesObj: typeof MESSAGES;
  private readonly constantsObj: typeof API_CONSTANTS;

  constructor({
    userService,
    messages,
    constants,
  }: {
    userService?: UserService;
    messages?: typeof MESSAGES;
    constants?: typeof API_CONSTANTS;
  } = {}) {
    this.userService = userService || new UserService();
    this.messagesObj = messages || MESSAGES;
    this.constantsObj = constants || API_CONSTANTS;
  }

  getAllUsers = async (
    request: FastifyRequest<{
      Querystring: { page?: string; limit?: string };
    }>,
    reply: FastifyReply
  ) => {
    const page = parseInt(
      request.query.page || env.PAGINATION_DEFAULT_PAGE.toString()
    );
    const limit = parseInt(
      request.query.limit || env.PAGINATION_DEFAULT_LIMIT.toString()
    );

    if (page && limit) {
      const result = await this.userService.getUsersPaginated(page, limit);
      return reply.send(
        ResponseUtil.paginated(result.users, page, limit, result.total)
      );
    } else {
      const users = await this.userService.getAllUsers();
      return reply.send(ResponseUtil.success(users));
    }
  };

  getUserById = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    const user = await this.userService.getUserById(id);
    return reply.send(ResponseUtil.success(user));
  };

  createUser = async (
    request: FastifyRequest<{ Body: CreateUserRequest }>,
    reply: FastifyReply
  ) => {
    const user = await this.userService.createUser(request.body);
    return reply
      .status(this.constantsObj.HTTP_STATUS.CREATED)
      .send(ResponseUtil.success(user, this.messagesObj.SUCCESS.USER_CREATED));
  };

  updateUser = async (
    request: FastifyRequest<{
      Params: { id: string };
      Body: UpdateUserRequest;
    }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    const user = await this.userService.updateUser(id, request.body);
    return reply.send(
      ResponseUtil.success(user, this.messagesObj.SUCCESS.USER_UPDATED)
    );
  };

  deleteUser = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    await this.userService.deleteUser(id);
    return reply.status(this.constantsObj.HTTP_STATUS.NO_CONTENT).send();
  };
}
