// index.js => 백엔드의 시작점이라고 생각

const express = require('express')
const app = express()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const {User} =require("./models/User");
const {auth} =require("./middlewar/auth");
const config = require('/config/key');

// application /x-www-from-urlencoded를 분석해서 가지고 올 수 있게 함  밑에는 json 형식
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
mongoose.connect(config.mongoURI)
  .then(()=> console.log('MongoDB connected!'))
  .catch(err => console.log(err))


// 아무거나 가능, 백서버로 두는 것.

app.get('/', (req, res) => res.send('Hello World!'))

app.post('api/users/register', (req, res)=>{
    //회원가입에 필요한 정보들을 클라이언트에서 가져오면 그것들을 DB에 넣어줌

    const user = new User(req.body) //bodyparser 때문에 이렇게 쓸 수 있음
    user.save((err, doc)=>{
        if(err) return res.json({success:false, err})
        return res.status(200).json({
            success:true
        })
    })
})

app.post('api/users/login', (req, res)=>{

    //요청된 이메일이 DB에 있는지 찾기
    User.findOne({email:req.body.email}, (err,user)=> {
        if(!user){
            return res.json({
                loginSuccess:false,
                 message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
    //있다면 비번이 맞는 비번인지 확인 
        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(!isMatch) //=비번 틀렸다는것
                return res.json({loginSuccess:false, message:"비밀번호가 틀렸습니다."})
            //맞다면 토큰 생성
            user.generateToken((err,user)=>{
                if (err) return res.status(400).send(err);
                
                // 토큰을 쿠키나 로컬스토리지등에 저장해둘것
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess:true, userId: user._id})

            })
        })
    })
})

// auth라는 미들웨어를 사용할 것 (콜백함수 하기전에 중간에 하는것)
app.get('api/users/auth', auth,(req,res)=>{
    // 성공적으로 미들웨어를 통과했을것
    res.status(200).json({
        _id: req.user._id, // auth에서 user을 req에 넣었기 때문에 이처럼 쓸 수 있음
        isAdmin: req.user.role === 0 ? false:true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname:req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

// 로그인 된 상태이므로 auth라는 미들웨어 넣어주면 됨
app.get('/api/users/logout', auth, (req,res)=>{
    // 미들웨어에서 가져와서 _id 찾은 후 token: ""으로 업데이트함 (findOneAndUpdate)
    User.findOneAndUpdate({_id:req.user._id},
        {token: ""},
        (err,user)=>{
            if(err) return res.json({success:false, err});
            return res.status(200).send({
                success:true
            })        
        })
})
const port = 5000  
app.listen(port, () => console.log(`Example app listening on port ${port}!`))