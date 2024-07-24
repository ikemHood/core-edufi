import { Context } from 'elysia';
import userServices from './services';
import { ContextWithJWT, ContextWithUser, SuccessResponse } from '../../types';
import { IUser, UpdateUserQuery } from './model';
import config from '../../constants/config';
import { randomToken } from '../../utils/randoms';
import { UnauthorizedError } from '../../helpers/errors';
import messages from '../../constants/messages';
import mongoose from 'mongoose';
import elasticMailSender, { genEmail } from '../../utils/mailer';

class userControllers {
   //post /api/v1/auth/register
   async register(ctx: Context): Promise<SuccessResponse<{}>> {
      const payload = ctx.body as IUser;

      await userServices.createUser(payload);
      return {
         message: 'Signup successful!',
      };
   }

   async isUsernameAvailable() {}

   //post /api/v1/auth/login
   async login(
      ctx: ContextWithJWT,
   ): Promise<SuccessResponse<{ token: string }>> {
      const payload = ctx.body as { email: string; password: string };

      const user = await userServices.findOneUser({ email: payload.email });

      const isValid = await user.comparePassword(payload.password);
      if (!isValid) {
         throw new Error('Invalid Email or Password!');
      }
      const token = await ctx.jwt.sign({ id: user.id, role: user.role });

      ctx.cookie.authorization.set({
         value: token,
         httpOnly: true,
         priority: 'high',
         maxAge: Date.now() + config.auth.cookie.expires,
      });

      return {
         message: 'User logged in successfully!',
         data: { token },
      };
   }

   //get /api/v1/auth/password/:email/forget
   async forgetPass(ctx: ContextWithJWT): Promise<SuccessResponse<string>> {
      const params = ctx.params as { email: string };
      const user = await userServices.findOneUser({ email: params.email });

      const otp = randomToken(6);
      const msg = genEmail(otp);

      // Done /////TODO: Send email to user
      const smsSent = await elasticMailSender({
         email: user.email,
         title: 'EDU BTCFI: Your one time password',
         html: msg,
         text: msg,
      });

      if (!smsSent) {
         throw new Error('Failed to send OTP');
      }

      const hasher = new Bun.CryptoHasher('sha256');
      const hash = hasher.update(otp).digest('hex');

      //save otp if msg was sent
      user.otp = hash; //Done /////TODO:  otp should somehow be hashed:
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      return {
         message: 'reset OTP sent',
      };
   }

   //post /api/v1/auth/password/:email/validate
   async validateOTP(
      ctx: ContextWithJWT,
   ): Promise<SuccessResponse<{ token: string }>> {
      const params = ctx.params as { email: string };
      const payload = ctx.body as { otp: string };

      const user = await userServices.findOneUser({ email: params.email });

      if (user.otpExpires && new Date() > user.otpExpires) {
         throw new Error('OTP has expired');
      }

      const hasher = new Bun.CryptoHasher('sha256');
      const hash = hasher.update(payload.otp).digest('hex');

      const validOtp = user.otp === hash; //Done TODO: if otp is hashed, this would change

      if (!validOtp) {
         throw new Error('Invalid OTP!');
      }

      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      const token = await ctx.jwt.sign({ id: user.id, role: user.role });

      return {
         message: 'success',
         data: { token },
      };
   }

   //post /api/v1/auth/password/:email/reset
   async resetPass(ctx: ContextWithJWT): Promise<SuccessResponse<string>> {
      const params = ctx.params as { email: string };
      const payload = ctx.body as {
         password: string;
         confirmPassword: string;
         token: string;
      };

      if (payload.password != payload.confirmPassword) {
         throw new Error('password and confirmPAssword must match');
      }

      const userFromToken = await ctx.jwt.verify(payload.token);

      if (!userFromToken) {
         throw new UnauthorizedError('Invalid token!');
      }

      const user = await userServices.findOneUser({ _id: userFromToken.id });

      if (user.email !== params.email) {
         throw new UnauthorizedError('Invalid token!');
      }

      user.password = payload.password;
      await user.save();

      return {
         message: 'Password reset successfully. Please Login.',
      };
   }

   //get /api/v1/cart/:id
   async addToCart(
      ctx: ContextWithUser,
   ): Promise<SuccessResponse<{ cart: unknown }>> {
      const userId = ctx.user.id;
      const { id } = ctx.params as { id: string };

      if (!mongoose.Types.ObjectId.isValid(id)) {
         throw new Error('Invalid course ID');
      }

      const updateQuery: UpdateUserQuery = { $addToSet: { cart: id } };

      const updatedUser = await userServices.updateUser(
         { _id: userId },
         updateQuery,
      );

      await updatedUser.populate('cart');

      return {
         message: 'Course added to cart successfully',
         data: {
            cart: updatedUser.cart,
         },
      };
   }

   //get /api/v1/cart
   async getCart(
      ctx: ContextWithUser,
   ): Promise<SuccessResponse<{ cart: unknown }>> {
      const userId = ctx.user.id;
      const user = await userServices.findOneUser({ _id: userId });

      await user.populate('cart');

      return {
         message: messages.FETCHED,
         data: {
            cart: user.cart,
         },
      };
   }

   //get /api/v1/watchlist/:id
   async addToWatchlist(
      ctx: ContextWithUser,
   ): Promise<SuccessResponse<{ watchlist: unknown }>> {
      const userId = ctx.user.id;
      const { id } = ctx.params as { id: string };

      if (!mongoose.Types.ObjectId.isValid(id)) {
         throw new Error('Invalid course ID');
      }

      const updateQuery: UpdateUserQuery = { $addToSet: { watchlist: id } };

      const updatedUser = await userServices.updateUser(
         { _id: userId },
         updateQuery,
      );

      await updatedUser.populate('watchlist');

      return {
         message: 'Course added to cart successfully',
         data: {
            watchlist: updatedUser.watchlist,
         },
      };
   }

   //get /api/v1/watchlist
   async getWatchlist(
      ctx: ContextWithUser,
   ): Promise<SuccessResponse<{ watchlist: unknown }>> {
      const userId = ctx.user.id;
      const user = await userServices.findOneUser({ _id: userId });

      await user.populate('watchlist');

      return {
         message: messages.FETCHED,
         data: {
            watchlist: user.watchlist,
         },
      };
   }

   //get /api/v1/me
   async me(ctx: ContextWithUser): Promise<SuccessResponse<{ user: IUser }>> {
      const userId = ctx.user.id;

      const user = await userServices.findOneUser({ _id: userId });

      return {
         message: messages.FETCHED,
         data: {
            user,
         },
      };
   }

   //post /api/v1/me
   async updateProfile(
      ctx: ContextWithUser,
   ): Promise<SuccessResponse<{ user: IUser }>> {
      const userId = ctx.user.id;
      const payload = ctx.body as Partial<IUser>;

      const user = await userServices.updateUser({ _id: userId }, payload);

      return {
         message: messages.FETCHED,
         data: {
            user,
         },
      };
   }

   // {@path "/api/v1/logout"}
   async logout(ctx: ContextWithUser): Promise<SuccessResponse<string>> {
      ctx.cookie.authorization.remove();

      return {
         message: 'User logged out successfully!',
      };
   }
}

export default new userControllers();
