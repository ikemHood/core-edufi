import mongoose, { Schema, Document, UpdateQuery } from 'mongoose';

export interface IUser extends Document {
   name: string;
   role: 'USER' | 'TUTOR' | 'ADMIN';
   username?: string;
   interest?: string[];
   email: string;
   bio?: string;
   phone_number?: string;
   password: string;
   otp?: string;
   otpExpires?: Date;
   enrolled_courses?: {
      course: mongoose.Types.ObjectId;
      enrolled_at: Date;
   }[];
   cart: mongoose.Types.ObjectId[];
   watchlist: mongoose.Types.ObjectId[];
   wallet_address?: string;
   comparePassword: (password: string) => Promise<boolean>;
   toJSON: () => object;
}

const enrolled = new Schema({
   course: { type: mongoose.Types.ObjectId, ref: 'Courses', required: true },
   enrolled_at: { type: Date, default: Date.now() },
});

const userSchema = new Schema(
   {
      name: { type: String, required: true, index: true },
      username: { type: String, unique: true },
      wallet_address: { type: String, unique: true },
      phone_number: { type: String, unique: true },
      email: {
         type: String,
         validate: {
            validator: function (data: string) {
               return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data);
            },
            message: '{VALUE} is not a valid email address',
         },
         unique: true,
         required: true,
      },
      password: { type: String, required: true },
      bio: { type: String },
      otp: { type: String },
      otpExpires: { type: Date },
      role: { type: String, enum: ['USER', 'TUTOR', 'ADMIN'], default: 'USER' },
      interest: [{ type: String, default: [] }],
      enrolled_courses: [{ type: enrolled, default: [] }],
      cart: [{ type: mongoose.Types.ObjectId, ref: 'Courses', default: [] }],
      watchlist: [
         { type: mongoose.Types.ObjectId, ref: 'Courses', default: [] },
      ],
   },
   {
      collection: 'Users',
      timestamps: true,
   },
);

// Pre-save middleware to hash the password
userSchema.pre<IUser>('save', async function (next) {
   if (this.isModified('password')) {
      this.password = Bun.password.hashSync(this.password!, {
         algorithm: 'bcrypt',
      });
   }
   next();
});

// Compares entered password with stored password
userSchema.methods.comparePassword = async function (password: string) {
   return Bun.password.verifySync(password, this.password!);
};

userSchema.methods.toJSON = function () {
   const obj = this.toObject();
   delete obj.password;
   delete obj.otp;
   delete obj.otpExpires;
   return obj;
};

export type UpdateUserQuery = UpdateQuery<IUser>;

export default mongoose.models.Users ||
   mongoose.model<IUser>('Users', userSchema);
