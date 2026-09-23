import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import flash from 'connect-flash';
import expressLayouts from 'express-ejs-layouts';
import newsRoutes from './modules/news/news.routes.js';


import userRoutes from './modules/user/user.routes.js';
import interactionRoutes from './modules/interactions/interaction.routes.js';

const app = express();

// Configuração do EJS + Layouts
app.set('views', path.join(process.cwd(), 'src/views/'));
app.set('layout', path.join(process.cwd(), 'src/views/layouts/main'));
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Middlewares globais
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'src/public')));
// Sessão + Flash
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    res.locals.user = req.session.user || null;
    res.locals.title = 'Shortz-App-TDD';
    next();
});

app.use('/', userRoutes);
app.use('/', interactionRoutes);
app.use('/', newsRoutes);


// Rotas (vamos adicionar mais depois)
app.get('/', (req, res) => res.render('pages/index', { title: 'NewsStream TDD' }));
// 404
app.use((req, res) => res.status(404).send('impossivel encontrar essa pagina'));


export default app;