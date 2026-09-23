import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';


//Função para validar dados no registro
const validateRegisterData = ({ password, confirmPassword }) => {
    if (password !== confirmPassword) {
        throw new Error('As senhas não coincidem!');
    }

    if (password.length < 8) {
        throw new Error('A senha deve ter no minimo 8 caracteres!');
    }
};


//Função para fazer o registro
export const register = async (data, userModel) => {
    const { username, email, password, confirmPassword, fullName = null } = data;

    validateRegisterData(data);

    const existingUser = await userModel.findOne({
        where: {
            [Op.or]: [{ username }, { email }]
        }
    });

    if (existingUser) {
        throw new Error('Username ou email já existente');
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
        username,
        email,
        password: hashedPassword,
        fullName
    });

    return {
        message: 'Usuário criado com sucesso',
        user: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            fullName: newUser.fullName
        }
    };
};


//Função para fazer o login
export const login = async (loginInput, password, userModel) => {
    const user = await userModel.findOne({
        where: {
            [Op.or]: [{ username: loginInput }, { email: loginInput }]
        }
    });

    if (!user) {
        throw new Error('E-mail, usuário, ou senha incorretos, favor verificar credênciais!');
    };

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        throw new Error('E-mail, usuário, ou senha incorretos, favor verificar credênciais!');
    };

    return {
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        profilePicture: user.profilePicture
    };
};


//Função para buscar um perfil
export const getProfile = async (userID, userModel) => {
    const user = await userModel.findByPk(userID, {
        attributes: ['id', 'username', 'email', 'fullName', 'bio', 'profilePicture']
    });

    if (!user) throw new Error('Usuário não encontrado');
    return user;
};