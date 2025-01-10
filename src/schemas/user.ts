import mongoose from "mongoose";
const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true , 'Email was not passed'],
    },
    username:{
        type:String,
        required:[true , 'A username is requied'],
    },
    password:{
        type:String,
        required:[true , 'Password was not passed']
    },
    role:{
        type:String,
        enum:['Influencer', 'Brand'],
        required:[true , 'User role was not passed'],
    }
} , { timestamps : true});
const UserModel = mongoose.model('User' , UserSchema);

export default UserModel;