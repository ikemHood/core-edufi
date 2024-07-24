import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import config from '../constants/config';

export default (app: Elysia) =>
    app.use(
        swagger({
            path: config.docs.swagger.path,
            documentation: {
                info: {
                    title: `Core Edufi BTCfi ${config.app.name} Documentation`,
                    version: config.app.version
                },
                tags: [
                    { name: 'App', description: 'General Endpoints' },
                    { name: 'Auth', description: 'Authentication Endpoints' },
                    { name: 'Users', description: 'Users Endpoints' },
                    { name: 'Courses', description: 'Courses Endpoints' },
                ]
            }
        })
    );
