import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';



let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];

class PostController implements Controller {
    public path = '/api/post';
    public router = Router();
 
    constructor() {
        this.initializeRoutes();
    }
 
    private getAll = async (request: Request, response: Response, next: NextFunction) => {
     response.status(200).json(testArr);
 }
 private getById = async (request: Request, response: Response, next: NextFunction) => {
     const { id } = request.params;
 
    
     response.status(200).json({"elem" : testArr[Number(id)]});
 }
 
 private getNums = async (request: Request, response: Response, next: NextFunction) => {
     const { num } = request.params;
 

     const slicedArray = testArr.slice(0, Number(num));
     response.status(200).json(slicedArray);
 }
 
 private deleteById = async (request: Request, response: Response, next: NextFunction) => {
     const { id } = request.params;
 
    
     testArr.splice(Number(id),1);
     response.status(204).json();
 }
 
 private deleteAll = async (request: Request, response: Response, next: NextFunction) => {
     testArr = [];
     response.status(204).json();
 }
 
 
 private addData = async (request: Request, response: Response, next: NextFunction) => {
     const { elem } = request.body;
 
     testArr.push(elem);
 
     response.status(201).json(testArr);
 }
 
    private initializeRoutes() {
        this.router.get(`${this.path}/latest`, this.getAll);
        this.router.get(`${this.path}s`, this.getAll);
        this.router.post(`${this.path}`, this.addData);
        this.router.get(`${this.path}/:id`, this.getById);
        this.router.post(`${this.path}/:num`, this.getNums);
        this.router.delete(`${this.path}/:id`, this.deleteById);
        this.router.delete(`${this.path}s`, this.deleteAll);
    }
}

export default PostController;