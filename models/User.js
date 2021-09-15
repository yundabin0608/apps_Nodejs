const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength:50
    },
    email:{
        type: String,
        trim:true,
        unique:1
    },
    password:{
        type: String,
        maxlength:50
    },
    role:{
        type: Number,
        default:0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp:{
        type: Number
    }
})

const user = mongoose.model('User', userSchema)
module.exports={User}
// 다른 파일에서도 쓸 수 있도록