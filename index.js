// index.js => 백엔드의 시작점이라고 생각

const express = require('express')
const app = express()
const port = 5000  
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {User} =require("./models/User");

// application /x-www-from-urlencoded를 분석해서 가지고 올 수 있게 함  밑에는 json 형식
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://dabin:0000@boilerplate.h5kqe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(()=> console.log('MongoDB connected!'))
  .catch(err => console.log(err))


// 아무거나 가능, 백서버로 두는 것.

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res)=>{
    //회원가입에 필요한 정보들을 클라이언트에서 가져오면 그것들을 DB에 넣어줌

    const user = new User(req.body) //bodyparser 때문에 이렇게 쓸 수 있음
    user.save((err, doc)=>{
        if(err) return res.json({success:false, err})
        return res.status(200).json({
            success:true
        })
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))