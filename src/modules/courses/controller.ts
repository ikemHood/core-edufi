import messages from '../../constants/messages';
import { ContextWithUser, SuccessResponse } from '../../types';
import { ICourse } from './model';
import courseServices from './services';

class courseControllers {
  //post /api/v1/courses
  async createCourse(
    ctx: ContextWithUser,
  ): Promise<SuccessResponse<{ course: ICourse }>> {
    const userId = ctx.user.id;
    const payload = ctx.body as ICourse;

    const course = await courseServices.createCourse({
      ...payload,
      creator: userId,
    });

    return {
      message: messages.CREATED,
      data: {
        course,
      },
    };
  }

  //get /api/v1/courses
  async fetchCourses(
    ctx: ContextWithUser,
  ): Promise<
    SuccessResponse<{
      courses: ICourse[];
      meta: { totalCourses: number; page: number; limit: number };
    }>
  > {
    const query = ctx.query as { limit: string; page: string; search: string };
    const payload = ctx.query as Partial<ICourse>;
    let page = Number(query.page);
    let limit = Number(query.limit);

    if (isNaN(page) || page < 1) {
      page = 1;
    }

    if (isNaN(limit) || limit < 1) {
      limit = 20;
    } else {
      limit = Math.min(Math.max(limit, 1), 100);
    }

    const skip = (page - 1) * limit;
    const search = query.search || '';

    const courses = await courseServices.findCourses(
      payload,
      search,
      skip,
      limit,
    );
    const totalCourses = await courseServices.countCourses(payload, search);

    return {
      message: messages.FETCHED,
      data: {
        courses,
        meta: {
          totalCourses,
          limit,
          page,
        },
      },
    };
  }

  //get /api/v1/courses/me
  async myCourses(
    ctx: ContextWithUser,
  ): Promise<
    SuccessResponse<{
      courses: ICourse[];
      meta: { totalCourses: number; page: number; limit: number };
    }>
  > {
    const query = ctx.query as { limit: string; page: string; search: string };
    const payload = ctx.query as Partial<ICourse>;
    let page = Number(query.page);
    let limit = Number(query.limit);

    if (isNaN(page) || page < 1) {
      page = 1;
    }

    if (isNaN(limit) || limit < 1) {
      limit = 20;
    } else {
      limit = Math.min(Math.max(limit, 1), 100);
    }

    const skip = (page - 1) * limit;
    const search = query.search || '';

    const courses = await courseServices.findCourses(
      { creator: ctx.user.id, ...payload },
      search,
      skip,
      limit,
    );
    const totalCourses = await courseServices.countCourses(
      { creator: ctx.user.id, ...payload },
      search,
    );

    return {
      message: messages.FETCHED,
      data: {
        courses,
        meta: {
          totalCourses,
          limit,
          page,
        },
      },
    };
  }
}

export default new courseControllers();
