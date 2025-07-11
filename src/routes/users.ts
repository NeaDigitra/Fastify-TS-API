import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    createdAt: new Date().toISOString()
  }
];

export async function userRoutes(fastify: FastifyInstance) {
  fastify.get('/users', async (_request: FastifyRequest, _reply: FastifyReply) => {
    return {
      data: users,
      total: users.length
    };
  });

  fastify.get<{ Params: { id: string } }>('/users/:id', async (request, reply) => {
    const { id } = request.params;
    const user = users.find(u => u.id === parseInt(id));
    
    if (!user) {
      reply.status(404).send({
        error: 'User not found',
        message: `User with id ${id} does not exist`
      });
      return;
    }
    
    return { data: user };
  });

  fastify.post<{ Body: { name: string; email: string } }>('/users', async (request, reply) => {
    const { name, email } = request.body;
    
    const newUser: User = {
      id: users.length + 1,
      name,
      email,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    reply.status(201).send({
      data: newUser,
      message: 'User created successfully'
    });
  });
}