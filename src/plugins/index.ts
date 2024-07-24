import { Elysia } from 'elysia';
import error from './error';
import security from './security';
import logger from './logger';
import swagger from './swagger';

export default (app: Elysia) =>
   app.use(swagger).use(logger).use(security).use(error);
