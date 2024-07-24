import Elysia from 'elysia';
import controller from './controller';
import userApiSchema from './validation';

export default (app: Elysia) =>
  app
    .use(userApiSchema)
    .post('/register', controller.register, { body: 'register' })
    .post('/login', controller.login, { body: 'login' })
    .post('/password/:email/forget', controller.forgetPass, { body: 'forgetPass' })
    .post('/password/:email/validate', controller.validateOTP, { body: 'validateOTP' })
    .post('/password/:email/reset', controller.resetPass, { body: 'resetPass' })
    