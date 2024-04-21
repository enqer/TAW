import { ObjectId } from "mongoose";
import {IData as IPost, Query} from "../models/data.model";
import PostModel from '../schemas/data.schema';

class DataService {
   public async createPost(postParams: IPost) {
       try {
           const dataModel = new PostModel(postParams);
           await dataModel.save();
       } catch (error) {
           console.error('Wystąpił błąd podczas tworzenia danych:', error);
           throw new Error('Wystąpił błąd podczas tworzenia danych');
       }
   }

   public async query(query: Query<number | string | boolean>) {
       try {
           const result = await PostModel.find(query, { __v: 0, _id: 0 });
           return result;
        } catch (error) {
            throw new Error(`Query failed: ${error}`);
        }
    }

    public async getById(query: Query<number | string | boolean>) {
        try {
            return await PostModel.findById(query, { __v: 0 });
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych:', error);
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }
 
    public async deleteData(query: Query<number | string | boolean>) {
        try {
            await PostModel.deleteMany(query);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych:', error);
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }

    public async deleteById(query: Query<number | string | boolean>) {
        try {
            await PostModel.deleteOne(query);
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych:', error);
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }

    public async deleteAllPosts() {
        try {
            await PostModel.deleteMany({})
        } catch (error) {
            console.error('Wystąpił błąd podczas usuwania danych:', error);
            throw new Error('Wystąpił błąd podczas usuwania danych');
        }
    }
 
 }
 
 export default DataService;