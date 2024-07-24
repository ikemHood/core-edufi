import { cleanFilterQuery } from "../../utils/cleanFilterQuery";
import coursesModel, { ICourse } from "./model";

class coursesService {
    async createCourse(payload: Partial<ICourse>): Promise<ICourse> {
        return await coursesModel.create(payload)
    }

    async updateCourse(searchData: Partial<ICourse>, updates: Partial<ICourse>): Promise<ICourse> {
        const filter = cleanFilterQuery({ ...searchData });
        const updatedCourse = await coursesModel.findOneAndUpdate(
            filter,
            updates,
            { new: true }
        ).exec();

        if (!updatedCourse) {
            throw new Error('Course not found');
        }

        return updatedCourse
    }

    async findCourses(searchData: Partial<ICourse>, search?: string, skip: number = 0, limit: number = 20): Promise<ICourse[]> {
        const filter = cleanFilterQuery({ ...searchData });

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { 'creator.name': { $regex: search, $options: 'i' } }
            ];
        }

        const courses = await coursesModel.find(filter)
            .limit(limit)
            .skip(skip)
            .populate('creator', "name id email")
            .exec();
        return courses;
    }

    async countCourses(searchData: Partial<ICourse>, search?: string): Promise<number> {
        const filter = cleanFilterQuery({ ...searchData });

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { 'creator.name': { $regex: search, $options: 'i' } }
            ];
        }
        
        return await coursesModel.countDocuments(filter)
    }

    async findOneCourse(searchData: Partial<ICourse>): Promise<ICourse> {
        const filter = cleanFilterQuery({ ...searchData });
        const course = await coursesModel.findOne(filter).exec();

        if (!course) {
            throw new Error('Course not found');
        }

        return course;
    }

    async deleteCourse(searchData: Partial<ICourse>): Promise<ICourse> {
        const filter = cleanFilterQuery({ ...searchData });
        const deletedCourse = await coursesModel.findOneAndDelete(
            filter,
        ).exec();
        return deletedCourse;
    }
}

export default new coursesService()