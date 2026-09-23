import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import * as userService from '../user.service.js';
import bcrypt from 'bcryptjs';

describe('User Service', () => {
    let mockUserModel;

    beforeEach(() => {
        mockUserModel = {
            findOne: vi.fn(),
            create: vi.fn(),
            findByPk: vi.fn()
        };
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('register', () => {
        it('deve retornar erro se as senhas não coincidirem', async () => {
            const data = {
                username: 'teste',
                email: 'teste@test.com',
                password: '12345678',
                confirmPassword: '87654321'
            };

            await expect(userService.register(data, mockUserModel))
                .rejects
                .toThrow('As senhas não coincidem!');
        });

        it('deve retornar erro se a senha tiver menos de 8 caracteres', async () => {
            const data = {
                username: 'teste',
                email: 'teste@test.com',
                password: '1234',
                confirmPassword: '1234'
            };

            await expect(userService.register(data, mockUserModel))
                .rejects
                .toThrow('A senha deve ter no minimo 8 caracteres!');
        });

        it('deve retornar erro se username ou email já existirem', async () => {
            const data = {
                username: 'teste',
                email: 'teste@test.com',
                password: '12345678',
                confirmPassword: '12345678'
            };

            mockUserModel.findOne.mockResolvedValueOnce({ id: 1 });

            await expect(userService.register(data, mockUserModel))
                .rejects
                .toThrow('Username ou email já existente');
        });

        it('deve cadastrar usuário com sucesso', async () => {
            const data = {
                username: 'teste',
                email: 'teste@test.com',
                password: '12345678',
                confirmPassword: '12345678',
                fullName: 'Teste da Silva'
            };

            mockUserModel.findOne.mockResolvedValueOnce(null);

            vi.spyOn(bcrypt, 'genSalt').mockResolvedValueOnce('salt');
            vi.spyOn(bcrypt, 'hash').mockResolvedValueOnce('senhaCriptografada');

            mockUserModel.create.mockResolvedValueOnce({
                id: 1,
                username: data.username,
                email: data.email,
                fullName: data.fullName
            });

            const result = await userService.register(data, mockUserModel);

            expect(mockUserModel.create).toHaveBeenCalledWith({
                username: 'teste',
                email: 'teste@test.com',
                password: 'senhaCriptografada',
                fullName: 'Teste da Silva'
            });

            expect(result.message).toBe('Usuário criado com sucesso');
            expect(result.user).toHaveProperty('id', 1);
            expect(result.user).toHaveProperty('username', 'teste');
            expect(result.user).toHaveProperty('email', 'teste@test.com');
            expect(result.user).toHaveProperty('fullName', 'Teste da Silva');
        });

        it('deve cadastrar usuário com fullName nulo quando não informado', async () => {
            const data = {
                username: 'teste',
                email: 'teste@test.com',
                password: '12345678',
                confirmPassword: '12345678'
            };

            mockUserModel.findOne.mockResolvedValueOnce(null);

            vi.spyOn(bcrypt, 'genSalt').mockResolvedValueOnce('salt');
            vi.spyOn(bcrypt, 'hash').mockResolvedValueOnce('senhaCriptografada');

            mockUserModel.create.mockResolvedValueOnce({
                id: 1,
                username: data.username,
                email: data.email,
                fullName: null
            });

            const result = await userService.register(data, mockUserModel);

            expect(mockUserModel.create).toHaveBeenCalledWith({
                username: 'teste',
                email: 'teste@test.com',
                password: 'senhaCriptografada',
                fullName: null
            });

            expect(result.user.fullName).toBeNull();
        });
    });

    describe('login', () => {
        it('deve fazer login com sucesso usando email ou username', async () => {
            const mockUser = {
                id: 1,
                username: 'teste',
                email: 'teste@test.com',
                password: 'senhaCriptografada',
                fullName: 'Teste da Silva',
                profilePicture: 'foto.png'
            };

            mockUserModel.findOne.mockResolvedValueOnce(mockUser);
            vi.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);

            const result = await userService.login('teste', 'teste123', mockUserModel);

            expect(result).toEqual({
                id: 1,
                username: 'teste',
                email: 'teste@test.com',
                fullName: 'Teste da Silva',
                profilePicture: 'foto.png'
            });
        });

        it('deve retornar erro se usuário não for encontrado no login', async () => {
            mockUserModel.findOne.mockResolvedValueOnce(null);

            await expect(userService.login('inexistente', '12345678', mockUserModel))
                .rejects
                .toThrow('E-mail, usuário, ou senha incorretos, favor verificar credênciais!');
        });

        it('deve retornar erro se a senha do login estiver incorreta', async () => {
            const mockUser = {
                id: 1,
                username: 'teste',
                email: 'teste@test.com',
                password: 'senhaCriptografada'
            };

            mockUserModel.findOne.mockResolvedValueOnce(mockUser);
            vi.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

            await expect(userService.login('teste', 'senhaErrada', mockUserModel))
                .rejects
                .toThrow('E-mail, usuário, ou senha incorretos, favor verificar credênciais!');
        });
    });

    describe('getProfile', () => {
        it('deve buscar perfil do usuário com sucesso', async () => {
            const mockUser = {
                id: 1,
                username: 'teste',
                email: 'teste@test.com',
                fullName: 'Teste da Silva',
                bio: 'Minha bio',
                profilePicture: 'foto.png'
            };

            mockUserModel.findByPk.mockResolvedValueOnce(mockUser);

            const result = await userService.getProfile(1, mockUserModel);

            expect(mockUserModel.findByPk).toHaveBeenCalledWith(1, {
                attributes: ['id', 'username', 'email', 'fullName', 'bio', 'profilePicture']
            });

            expect(result).toEqual(mockUser);
        });

        it('deve retornar erro se perfil do usuário não for encontrado', async () => {
            mockUserModel.findByPk.mockResolvedValueOnce(null);

            await expect(userService.getProfile(99, mockUserModel))
                .rejects
                .toThrow('Usuário não encontrado');
        });
    });
});