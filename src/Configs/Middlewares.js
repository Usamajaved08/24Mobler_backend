import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";

const applyMiddlewares = (app) => {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    }))
};
export { applyMiddlewares };
