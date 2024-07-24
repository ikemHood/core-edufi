import mongoose, { Schema, Document } from 'mongoose';

const courseSchema = new Schema(
  {
    name: { type: String, required: true, index: true },
    price: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true, index: true },
    lessons: [{ type: mongoose.Types.ObjectId, ref: 'Lessons' }],
    tags: [{ type: String, default: [] }],
    creator: { type: mongoose.Types.ObjectId, ref: 'Users', required: true },
  },
  {
    collection: 'Courses',
    timestamps: true,
  },
);

export interface ICourse extends Document {
  name: string;
  price: string;
  image: string;
  description: string;
  tags?: string[];
  creator: mongoose.Types.ObjectId | String;
  lessons?: mongoose.Types.ObjectId[];
}

export default mongoose.models.Courses ||
  mongoose.model<ICourse>('Courses', courseSchema);
