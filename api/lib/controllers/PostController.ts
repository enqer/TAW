import { checkPostCount } from '../middlewares/checkPostCount.middleware'
import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';
import DataService from '../modules/services/data.service';
import Joi from 'joi';
import { IData } from 'modules/models/data.model';




let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];

class PostController implements Controller {
    public path = '/api/post';
    public router = Router();
    public dataService = new DataService;
 
    constructor() {
        this.initializeRoutes();
    }
 
//     private getAll = async (request: Request, response: Response, next: NextFunction) => {
//      response.status(200).json(testArr);
//  }
 private getElementById = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    // const allData = await this.dataService.query({_id: id});
    const allData = await this.dataService.getById({_id: id})
    response.status(200).json(allData);
 }
 
 private removePost = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    await this.dataService.deleteData({_id: id});
    response.sendStatus(200);
 };
 
 
 private getNums = async (request: Request, response: Response, next: NextFunction) => {
     const { num } = request.params;
 

     const slicedArray = testArr.slice(0, Number(num));
     response.status(200).json(slicedArray);
 }
 
 private deleteById = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;
    await this.dataService.deleteById({_id: id});
    response.sendStatus(200);
 }
 
 private deleteAllPosts = async (request: Request, response: Response, next: NextFunction) => {
    await this.dataService.deleteAllPosts();
    response.sendStatus(200);
 }
 
 
 private addData = async (request: Request, response: Response, next: NextFunction) => {
    const {title, text, image} = request.body;
 
    const schema  = Joi.object({
        title: Joi.string().required(),
        text: Joi.string().required(),
        image: Joi.string().uri().required()
     });
    
   try {
    const validateData = await schema.validateAsync({title, text, image});
    await this.dataService.createPost(validateData);
    response.status(200).json(validateData);
} catch (error) {
    console.log('eeee', error)

    console.error(`Validation Error: ${error.message}`);
    response.status(400).json({error: 'Invalid input data.'});
}
}

 
    private initializeRoutes() {
        // this.router.get(`${this.path}/latest`, this.getAll);
        // this.router.get(`${this.path}s`, this.getAll);
        this.router.post(`${this.path}`, this.addData);
        this.router.get(`${this.path}/:id`, this.getElementById);
        // this.router.post(`${this.path}/:num`, this.getNums);
        this.router.delete(`${this.path}/:id`, this.deleteById);
        this.router.delete(`${this.path}s`, this.removePost);
        this.router.delete(`${this.path}`, this.deleteAllPosts);
        this.router.post(`${this.path}/:num`, checkPostCount, this.getNums);
    }
}

export default PostController;