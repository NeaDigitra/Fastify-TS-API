import { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/user.service';
import { ResponseUtil } from '../utils/response';
import { CreateUserRequest, UpdateUserRequest } from '../types';

export class UserController {
  private userService = new UserService();

  getAllUsers = async (
    request: FastifyRequest<{
      Querystring: { page?: string; limit?: string };
    }>,
    reply: FastifyReply
  ) => {
    const page = parseInt(request.query.page || '1');
    const limit = parseInt(request.query.limit || '10');

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
      .status(201)
      .send(ResponseUtil.success(user, 'User created successfully'));
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
    return reply.send(ResponseUtil.success(user, 'User updated successfully'));
  };

  deleteUser = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    const { id } = request.params;
    await this.userService.deleteUser(id);
    return reply.status(204).send();
  };
}
