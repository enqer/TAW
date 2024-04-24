import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';
import {auth} from '../middlewares/auth.middleware';
import UserService from "../modules/services/user.service";
import PasswordService from "../modules/services/password.service";
import TokenService from "../modules/services/token.service";
import { secured } from '../middlewares/secured.middleware';

class UserController implements Controller {
   public path = '/api/user';
   public router = Router();
   private userService = new UserService();
   private passwordService = new PasswordService();
   private tokenService = new TokenService();

   constructor() {
       this.initializeRoutes();
   }

   private initializeRoutes() {
       this.router.post(`${this.path}/create`, this.createNewOrUpdate);
       this.router.post(`${this.path}/auth`, this.authenticate);
       this.router.delete(`${this.path}/logout/:userId`, auth,  this.removeHashSession);
       this.router.patch(`${this.path}/:userId/reset`,  this.resetPassword);
       this.router.delete(`${this.path}/:userId`, secured,  this.deleteUser);
    }

    private authenticate = async (request: Request, response: Response, next: NextFunction) => {
        const {login, password} = request.body;

        try {
            const user = await this.userService.getByEmailOrName(login);
            if (!user) {
                response.status(401).json({error: 'Unauthorized'});
            }
            await this.passwordService.authorize(user.id, await this.passwordService.hashPassword(password));
            this.tokenService.remove(user._id)
            const token = await this.tokenService.create(user);
            response.status(200).json(this.tokenService.getToken(token));
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(401).json({error: 'Unauthorized'});
        }
     };
     
     private createNewOrUpdate = async (request: Request, response: Response, next: NextFunction) => {
        const userData = request.body;
        try {
            const user = await this.userService.createNewOrUpdate(userData);
            if (userData.password) {
                const hashedPassword = await this.passwordService.hashPassword(userData.password)
                await this.passwordService.createOrUpdate({
                    userId: user._id,
                    password: hashedPassword,
                });
            }
            response.status(200).json(user);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({error: 'Bad request', value: error.message});
        }
     
     };

     private deleteUser = async (request: Request, response: Response, next: NextFunction) => {
        const { userId} = request.params;
        try {
            await this.userService.deleteUser(userId);
            response.status(200).json({info: 'deleted'});
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({error: 'Bad request', value: error.message});
        }
     
     };


     private resetPassword = async (request: Request, response: Response, next: NextFunction) => {
        const { userId } = request.params;
        const token  = request.header('x-access-token');
        try {
            await this.userService.changePassword(userId, token);
            // response.status(200).json({he: 'Sprawdź maila'});
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(400).json({error: 'Bad request', value: error.message});
        }
     
     };
     
     private removeHashSession = async (request: Request, response: Response, next: NextFunction) => {
        const {userId} = request.params
        try {
            const result = await this.tokenService.remove(userId);
            response.status(200).send(result);
        } catch (error) {
            console.error(`Validation Error: ${error.message}`);
            response.status(401).json({error: 'Unauthorized'});
        }
     };
     
     
}

export default UserController;