import Elysia from 'elysia';
import controller from './controller';
import courseApiSchema from './validations';
import auth from '../../plugins/auth';

export default (app: Elysia) =>
    app
        .guard({ detail: { tags: ['Courses'] } })
        .use(courseApiSchema)
        .use(auth)
        .post('/api/v1/courses', controller.createCourse, { body: "createCourse" })
        .get('/api/v1/courses', controller.fetchCourses, { body: 'fetchCourses' })
        .get('/api/v1/courses/me', controller.myCourses, { body: 'fetchCourses' })
