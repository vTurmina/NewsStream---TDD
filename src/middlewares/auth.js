export const isAuthenticad = (req, res, next) => {
    if (req.session.user) {
        return next();
    }

    req.flash('error', 'Para acessar essa página, você precisa estar logado');
    res.redirect('/login');
};

export default isAuthenticad;