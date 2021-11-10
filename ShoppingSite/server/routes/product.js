const express = require('express');
const router = express.Router();
const multer = require('multer');
const {Product} = require('../models/Product');

//=================================
//             Product
//=================================

// multer을 이용한 이미지 저장
// destination : 파일이 저장될 장소
// filename : 파일명
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb){
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

var upload = multer({storage:storage}).single('file')

// 인덱스에서 작성햇듯 /api/product를 타고오므로 그 뒷부분인 image만 입력하면 됨
router.post('/image', (req, res) => {
    // 가져온 이미지를 저장 -> multer 사용
    upload(req, res, (err) =>{
        if(err){
            return req.json({success: false, err})
        }
        // 성공시 파일이 어디에 저장되었는지, 파일이름등을 저장
        return res.json({success: true, filePath: res.req.file.path , fileName: res.req.file.filename})
    })
})

// api/product에서 수행해야 하므로
router.post('/', (req, res) => {
    
    // 받아온 정보들을 db에 넣기
    const product = new Product(req.body)
    product.save((err)=>{
        if(err) return res.status(400).json({success:false, err})
        return res.status(200).json({success:true})
    })

})


router.post('/products', (req,res)=>{
    //produc 안의 모든 상품 가져오기. 조건주고싶으면 find 안에 {}객체로 표시
    Product.find()
        .popultate("writer")
        .exec((err,productInfo)=>{
            // json 형식으로 프론트로 정보 보내는것
            if (err) return res.status(400).json({success:false, err})
            return res.status(200).json({success:true, productInfo})
        })


})

module.exports = router;
