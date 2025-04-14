import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    role: string;
    // adicione outros campos do payload do token se quiser
  };
}
