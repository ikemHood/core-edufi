import Elysia from 'elysia';
import controller from './controller';
import userApiSchema from './validation';
import auth from '../../plugins/auth';

export default (app: Elysia) =>
    app
        .guard({ detail: { tags: ['Auth'] } })
        .use(userApiSchema)
        .post('/register', controller.register, { body: 'register' })
        .post('/login', controller.login, { body: 'login' })
        .post('/password/:email/forget', controller.forgetPass, { body: 'forgetPass' })
        .post('/password/:email/validate', controller.validateOTP, { body: 'validateOTP' })
        .post('/password/:email/reset', controller.resetPass, { body: 'resetPass' })

export const userRoutes = (app: Elysia) =>
    app
        .guard({ detail: { tags: ['Users'] } })
        .use(userApiSchema)
        .use(auth)
        .get("/me", controller.me )
        .post("/me", controller.updateProfile, {body: "updateProfile"} )
        .get("/watchlist", controller.getWatchlist )
        .get("/cart", controller.getCart )
        .get("/cart/:id", controller.addToCart, { params: "addToCart" } )
        .get("/watchlist/:id", controller.addToWatchlist, { params: "addToWatchlist" } )