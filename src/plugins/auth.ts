import { Elysia } from 'elysia';
import type { LoggedInUser } from '../types';
import { UnauthorizedError } from '../helpers/errors';


export default (app: Elysia) =>
  app.derive(
    async ({
      //@ts-expect-error
      jwt,
      headers: { authorization },
      cookie: { authorization: cookieAuth }
    }) => {
      const user: LoggedInUser = await jwt.verify(authorization?.split(' ')[1] ?? cookieAuth.value);

      if (!user) {
        throw new UnauthorizedError('Invalid token!');
      }

      return {
        user
      };
    }
  );
