import Elysia from 'elysia';
import controller from './controller';
import userApiSchema from './validation';
import auth from '../../plugins/auth';

export default (app: Elysia) =>
    app
        .guard({ detail: { tags: ['Auth'] } })
        .use(userApiSchema)
        .post('/api/v1/auth/register', controller.register, { body: 'register' })
        .post('/api/v1/auth/login', controller.login, { body: 'login' })
        .get('/api/v1/auth/password/:email/forget', controller.forgetPass, { body: 'forgetPass' })
        .post('/api/v1/auth/password/:email/validate', controller.validateOTP, { body: 'validateOTP' })
        .post('/api/v1/auth/password/:email/reset', controller.resetPass, { body: 'resetPass' })

export const userRoutes = (app: Elysia) =>
    app
        .guard({ detail: { tags: ['Users'] } })
        .use(userApiSchema)
        .use(auth)
        .get("/api/v1/me", controller.me )
        .post("/api/v1/me", controller.updateProfile, {body: "updateProfile"} )
        .get("/api/v1/watchlist", controller.getWatchlist )
        .get("/api/v1/cart", controller.getCart )
        .get("/api/v1/cart/:id", controller.addToCart, { params: "addToCart" } )
        .get("/api/v1/watchlist/:id", controller.addToWatchlist, { params: "addToWatchlist" } )