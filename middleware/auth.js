const { User } = require("../models/User");

let auth = (req,res,next)=>{

    // 인증처리 수행

    // 클라이언트 쿠키에서 토큰을 가져오기 -> 쿠키파서 이용
    let token = req.cookies.x_auth;

    // 토큰 복호화 후 유저 찾기
    User.findByToken(token, (err,user)=>{
        if(err) throw err;
        if(!user) return res.json({isAuth:false, error:true})

        req.token = token;
        req.user = user;
        next(); // 미들웨어에서 계속 갈 수 있도록 써줌
    })

    // 있다면 인증 O 아니면 X
}

module.exports = {auth};