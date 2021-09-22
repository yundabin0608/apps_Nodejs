const mongoose = require('mongoose');
const bcrypt=require('bcrypt')
const saltRounds = 10

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
// pre는 몽구스에서 가져온 메소드로 유저정보 저장 전 function 수행
userSchema.pre('save', function(next){
   //비밀번호 암호화 시키기
   var user = this;

   if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err,salt){
            if(err) return next(err)
            
            bcrypt.hash(user.password,salt,function(err,hash){ // 여기서 hash는 암호화된 비번
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

const user = mongoose.model('User', userSchema)
module.exports={User}
// 다른 파일에서도 쓸 수 있도록