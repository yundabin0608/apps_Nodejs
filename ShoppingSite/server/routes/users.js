const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart:  req.user.cart,
        history: req.user.history
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post("/addToCart", auth, (req, res) => {

    // 해당 사용자 찾기
    // auth middleware 때문에 가능. 쿠키속 토큰을 이용해 유저의 정보 가져옴
    User.findOne({ _id: req.user._id},
        (err, userInfo) => {
            
            // 가져온 정보에서 카트 상품의 중복여부 파악
            let duplicate = false;
            userInfo.cart.forEach((item) => {
                if(item.id === req.body.productId){
                    duplicate = true;
                }
            })

            // 상품이 이미 있을 때
            if(duplicate){
                User.findOneAndUpdate(
                    {_id: req.user._id, "cart.id" : req.body.productId},
                    { $inc: { "cart.$.quantity": 1}}, // 상품갯수를 1개 올림
                    { new: true},
                    (err, userInfo) => {
                        if(err) return res.status(200).json({success: false, err})
                        res.status(200).send(userInfo.cart)
                    }
                )
            }else{ // 상품이 이미 있지 않을 때 
                User.findOneAndUpdate(
                    {_id: req.user._id},
                    {
                        // 카트에 아이디, 수량, 날짜 모두 넣어줄 것
                        $push: {
                            cart: {
                                id: req.body.productId,
                                quantity: 1,
                                date: Date.now()
                            }
                        }
                    },
                    {new: true},
                    (err, userInfo) => {
                        if(err) return res.status(400).json({success: false, err})
                        res.status(200).send(userInfo.cart)
                    }
                )
            }

        })

});

router.get('/removeFromCart', auth, (req, res) => {
    // 먼저 cart 안에 내가 지우려고 한 상품 지우기
    User.findOneAndUpdate(
        {_id: req.user._id},
        {
            "$pull":
            {"cart": {"id": req.query.id}}
        },
        {new: true},
        (err, userInfo) => {
            let cart = userInfo.cart;
            let array = cart.map(item => {
                return item.id
            })
        }
    )

    // product collection에서 현재 남아있는 상품들의 정보를 가져오기

    Product.find({ _id: {$in: array}})
        .populate('writer')
        .exec((err, productInfo) => {

            return res.status(200).json({
                productInfo,
                cart
            })
        })
})

module.exports = router;
