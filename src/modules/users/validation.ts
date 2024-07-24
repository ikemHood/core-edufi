import { password } from 'bun';
import { t, Elysia } from 'elysia';

export default new Elysia().model({
  register: t.Object({
      name: t.String(),
      role: t.Optional(t.String()),
      email: t.String({ format: 'email' }),
      password: t.String({ maxLength: 64 }),
  }),

  login: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ maxLength: 64 }),
  }),

  email: t.Object({
      email: t.String({ format: 'email' }),
  }),
  
  otp: t.Object({
      otp: t.String({ minLength: 6, maxLength: 6 }),
  }),

  resetPass: t.Object({
      token: t.String({ minLength: 6, maxLength: 6 }),
      password: t.String({ maxLength: 64 }),
      confirmPassword: t.String({ maxLength: 64 }),
  }),

  courseId: t.Object({
      id: t.String(),
  }),

  updateProfile: t.Object({
    name: t.Optional(t.String()),
    bio: t.Optional(t.String()),
    role: t.Optional(t.String()),
    username: t.Optional(t.String()),
    phone_number: t.Optional(t.String()),
    wallet_address: t.Optional(t.String()),
    interest: t.Optional(t.Array(t.String())),
  }),
});
