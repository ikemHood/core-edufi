import { ResponseStatus } from '../constants/codes';
import messages from '../constants/messages';
import { Elysia } from 'elysia';
import { ConflictError, UnauthorizedError } from '../helpers/errors';


export default (app: Elysia) =>
  app.error({ ConflictError, UnauthorizedError }).onError((handler) => {
    console.error(handler.error?.stack);

    if (handler.error instanceof ConflictError || handler.error instanceof UnauthorizedError) {
      handler.set.status = handler.error.status;

      return {
        message: handler.error.message,
        code: handler.error.status
      };
    }

    if (handler.code === 'NOT_FOUND') {
      handler.set.status = ResponseStatus.NOT_FOUND;
      return {
        message: messages.NOT_FOUND,
        code: handler.set.status
      };
    }

    if (handler.code === 'VALIDATION') {
      handler.set.status = ResponseStatus.BAD_REQUEST;
      return {
        message: messages.BAD_PARAMETERS,
        code: handler.set.status
      };
    }

    handler.set.status = ResponseStatus.SERVICE_UNAVAILABLE;

    return {
      message: messages.ERROR,
      code: handler.set.status
    };
  });
