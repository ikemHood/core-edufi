import { Context } from 'elysia';

export interface ContextWithJWT extends Context {
   jwt: {
      readonly sign: (
         morePayload: Record<string, string | number>,
      ) => Promise<string>;
      readonly verify: (
         jwt?: string | undefined,
      ) => Promise<false | Record<string, string | number>>;
   };
}

export interface LoggedInUser {
   readonly id: string;
   readonly role: 'USER' | 'TUTOR' | 'ADMIN';
}

export interface ContextWithUser extends ContextWithJWT {
   readonly user: LoggedInUser;
}

export interface ErrorResponse<Code = string> {
   message: string;
   code: Code;
}

export interface SuccessResponse<T> {
   message: string;
   data?: T;
}
