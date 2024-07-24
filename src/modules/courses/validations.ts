import { t, Elysia } from 'elysia';

export default new Elysia().model({
   createCourse: t.Object({
      name: t.String(),
      price: t.String(),
      image: t.String(),
      description: t.String(),
      tags: t.Optional(t.Array(t.String())),
      creator: t.Optional(t.String()),
      lessons: t.Optional(t.Array(t.String())),
   }),

   fetchCourses: t.Object({
      limit: t.Optional(t.String()),
      page: t.Optional(t.String()),
      search: t.Optional(t.String()),
      name: t.Optional(t.String()),
      price: t.Optional(t.String()),
      creator: t.Optional(t.String()),
   }),
});
