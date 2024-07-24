import { Elysia } from "elysia";
import error from "./error";
import security from "./security";
import logger from "./logger";

export default (app: Elysia) =>
    app
        .use(logger)
        .use(security)
        .use(error)
