import { Elysia } from 'elysia';
import config from './constants/config';
import db from './plugins/db';
import plugins from './plugins';

const app = new Elysia();
db();
app
  .use(plugins)
  .get('/', () => 'Hello Elysia')
  .listen(config.app.port, () => {
    console.log(`Environment: ${config.app.env}`);
    console.log(
      `${config.app.name} API Server is running at ${app.server?.hostname}:${app.server?.port}`,
    );
  });
