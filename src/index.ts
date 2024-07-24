import { Elysia } from 'elysia';
import config from './constants/config';
import db from './plugins/db';
import plugins from './plugins';
import authRoutes, { userRoutes } from './modules/users/routes';
import courseRoutes from './modules/courses/routes';

const Routes = (app: Elysia) =>
  app
    .guard({ detail: { tags: ['App'] } })
    .get('/', () => ({
      name: config.app.name,
      version: config.app.version
    }))
    .use(authRoutes)
    .use(userRoutes)
    .use(courseRoutes)

const app = new Elysia();
db();
app.use(plugins)
  .use(Routes)
  .listen(config.app.port, () => {
    console.log(`Environment: ${config.app.env}`);
    console.log(
      `${config.app.name} API Server is running at ${app.server?.hostname}:${app.server?.port}`,
    );
  });
