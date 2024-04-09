import Controller from '../interfaces/controller.interface';
import {Request, Response, NextFunction, Router} from 'express';



let testArr = [4,5,6,3,5,3,7,5,13,5,6,4,3,6,3,6];

class DataController implements Controller {
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

    if (! Number.isInteger(Number(id)) || Number(id) >= testArr.length || Number(id) < 0) {
        return response.status(404).json({ error: "Not found." });
    }
    
    response.status(200).json(testArr[Number(id)]);
}

private getNums = async (request: Request, response: Response, next: NextFunction) => {
    const { num } = request.params;

    if (! Number.isInteger(Number(num)) || Number(num) >= testArr.length || Number(num) < 0) {
        return response.status(404).json({ error: "Not found." });
    }
    const slicedArray = testArr.slice(0, Number(num));
    response.status(200).json(slicedArray);
}

private deleteById = async (request: Request, response: Response, next: NextFunction) => {
    const { id } = request.params;

    if (! Number.isInteger(Number(id)) || Number(id) >= testArr.length || Number(id) < 0) {
        return response.status(404).json({ error: "Not found." });
    }
    testArr.slice(Number(id),1);
    response.status(204);
}

private deleteAll = async (request: Request, response: Response, next: NextFunction) => {
    testArr = [];
    response.status(204);
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
       this.router.post(`${this.path}/:id`, this.getById);
       this.router.post(`${this.path}/:num`, this.getNums);
       this.router.delete(`${this.path}/:id`, this.deleteById);
       this.router.delete(`${this.path}s`, this.deleteAll);
   }

}

export default DataController;