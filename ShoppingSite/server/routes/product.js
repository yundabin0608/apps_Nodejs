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

    let limit = req.body.limit ? parseInt(req.body.limit):40 ;// limit은 임의
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;
    let term = req.body.searchTerm; 
    let findArgs = {};

    for(let key in req.body.filters){
        // contitnets []에 하나 이상 있으면  findArgs에 넣기 -> product.find() 할때 사용
        // 필터에 두개부분이 있음 key에는 price와 continent가 존재함
        if(req.body.filters[key.length > 0]){

            if(key === "price"){
                findArgs[key] = {
                    // mongoDB에서 사용, 이것보다 크거나 같고를 의미
                    $gte: req.body.filters[key][0], 
                    // 이것보다 작거나 같음을 의미
                    $lte: req.body.filters[key][1]
                    // [200,299]이면 200부터 299까지에 해당
                }
            }else{
                findArgs[key] = req.body.filters[key];
            }
            
        }
    }

    if(term){
        Product.find(findArgs)
        .find({ $text: {$search: term}}) 
        .populate("writer")
        .skip(skip)    // 상품 skip 번째부터 가져와
        .limit(limit)  // 상품 limit 수만큼 가져올것
        .exec((err, productInfo) => {
             // json 형식으로 프론트로 정보 보내는것
            if(err) return res.status(400).json({ success: false, err})
            return res.status(200).json({
                success: true, productInfo,
                postSize: productInfo.length
            })
        })
    }else{
        Product.find(findArgs)
        .populate("writer")
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) => {
            if(err) return res.status(400).json({ success: false, err})
            return res.status(200).json({
                success: true, productInfo,
                postSize: productInfo.length
            })
        })
    }
})

router.get('/products_by_id', (req, res) => {
    
    // 쿼리를 가져오는 경우 req.body가 아닌 req.query를 이용
    let type = req.query.type
    let productIds = req.query.diskStorage

    if(type === "array"){
        let ids = req.query.id.split(',')
        productIds = ids.map(item => {
            return item
        })
    }
    // productId를 이용해 DB에서 동일한 상품 정보를 가져오기
    Product.find({ _id: {$in: productIds}})
        .populate('writer')
        .exec((err, product) => {
            if(err) return res.status(400).send(err)
            return res.status(200).send(product)
        })

})

axios.get(`api/product/products_by_id?id=${productIds}&type=single`)

module.exports = router;
