import { t, Elysia } from 'elysia';

export default new Elysia().model({
  register: t.Object({
    body: t.Object({
      name: t.String(),
      role: t.Optional(t.String()),
      email: t.String({ format: 'email' }),
      password: t.String({ maxLength: 64 }),
    }),
  }),

  login: t.Object({
    body: t.Object({
      email: t.String({ format: 'email' }),
      password: t.String({ maxLength: 64 }),
    }),
  }),

  forgetPass: t.Object({
    params: t.Object({
      email: t.String({ format: 'email' }),
    }),
  }),

  validateOTP: t.Object({
    params: t.Object({
      email: t.String({ format: 'email' }),
    }),
    body: t.Object({
      otp: t.String({ minLength: 6, maxLength: 6 }),
    }),
  }),

  resetPass: t.Object({
    params: t.Object({
      email: t.String({ format: 'email' }),
    }),
    body: t.Object({
      token: t.String({ minLength: 6, maxLength: 6 }),
      password: t.String({ maxLength: 64 }),
      confirmPassword: t.String({ maxLength: 64 }),
    }),
  }),

  addToWatchlist: t.Object({
    params: t.Object({
      id: t.String(),
    }),
  }),

  addToCart: t.Object({
    params: t.Object({
      id: t.String(),
    }),
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
