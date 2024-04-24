import  UserModel  from '../schemas/user.schema';
import {IUser} from "../models/user.model";
import { generateRandomPassword } from '../../utils/generatePassword'
import { sendMail } from '../../utils/emailSender';
import { Mongoose, Types } from 'mongoose';


class UserService {
   
   
   
   public async changePassword(id: string, token: string ) {
        const user = await UserModel.findOne({ $or: [{ _id: id }, { _id: id }] })
        const jwt = token.substring(7);
        const claims = atob(jwt.split('.')[1])
        console.log(user)
        if (!claims.includes(user.email))
            throw new Error('Wystąpił błąd podczas zmiany hasła')
        const newPass = generateRandomPassword(8);
       try {
            UserModel.findByIdAndUpdate(id, {$set: { password: newPass}})
            const mailOptions = {
                from: '*****',
                to: user.email,
                subject: 'New Password here',
                text: newPass
              };
              sendMail(mailOptions)
       } catch(error ){
            throw new Error('Wystąpił błąd podczas zmiany hasła');
       }
   }
   public async deleteUser(userId: string) {
    console.log(userId)
    try {
        const result = await UserModel.deleteOne({_id: new Types.ObjectId(userId)})
        console.log(result)
    }catch (error) {
           throw new Error('Wystąpił błąd podczas usuwania juserów');
       }
}

   public async createNewOrUpdate(user: IUser) {
       console.log(user)
       try {
           if (!user._id) {
               const dataModel = new UserModel(user);
               return await dataModel.save();
           } else {
               return await UserModel.findByIdAndUpdate(user._id, { $set: user }, { new: true });
           }
       } catch (error) {
           console.error('Wystąpił błąd podczas tworzenia danych:', error);
           throw new Error('Wystąpił błąd podczas tworzenia danych');
       }
   }

   public async getByEmailOrName(name: string) {
       try {
        const result = await UserModel.findOne({ $or: [{ email: name }, { name: name }] });
        if (result) {
            return result;
        }
    } catch (error) {
        console.error('Wystąpił błąd podczas pobierania danych:', error);
        throw new Error('Wystąpił błąd podczas pobierania danych');
    }
}
}

export default UserService;