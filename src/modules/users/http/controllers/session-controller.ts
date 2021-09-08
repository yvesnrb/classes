import { Request, Response } from 'express';

import AuthenticateUserService from '@services/authenticate-user-service';

export default class SessionController {
  private authenticateUser: AuthenticateUserService;

  constructor() {
    this.authenticateUser = new AuthenticateUserService();
  }

  public async create(request: Request, response: Response): Promise<void> {
    const { email, password } = request.body;
    const credentials = await this.authenticateUser.execute({
      email,
      password,
    });

    response.json(credentials);
  }
}
