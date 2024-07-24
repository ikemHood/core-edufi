import { Elysia } from 'elysia';
import type { LoggedInUser } from '../types';
import { UnauthorizedError } from '../helpers/errors';
import config from '../constants/config';

export default (app: Elysia) =>
   app.derive(
      async ({
         //@ts-expect-error
         jwt,
         headers: { authorization },
         cookie: { authorization: cookieAuth },
         path,
      }) => {
         const user: LoggedInUser = await jwt.verify(
            authorization?.split(' ')[1] ?? cookieAuth.value,
         );

         if (!user && !path.includes(config.docs.swagger.path)) {
            throw new UnauthorizedError('Invalid token!');
         }

         return {
            user,
         };
      },
   );
