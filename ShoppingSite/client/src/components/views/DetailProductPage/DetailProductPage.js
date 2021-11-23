import React, {useEffect, useState} from 'react';
import axios from 'axios';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import {Row, Col} from 'antd';

function DetailProductPage(prop) {

    // 주소에 있던 localhost:3000/product/~~(unique id) 여기 유니크 아이디임
    // 백에서 받아온 정보는 Product에 넣어줌 (setProduct 이용)
    const productId = prop.match.params.productId
    const [Product, setProduct] = useState({})

    // unique id로 찾은 하나의 상품정보를 백에 요청, 결과값은 response에 들어감
    useEffect(() => {
        axios.get(`api/product/products_by_id?id=${productId}&type=single`)
            .then(response => {
                if(response.data.success){
                    setProduct(response.data.product[0])
                }else{
                    alert('상세 정보 가져오기를 실패했습니다')
                }
            })
    }, [])

    return (
        <div style={{width: '100%', padding: '3rem 4rem'}}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <h1>{Product.title}</h1>
            </div>
            <br />
            <Row gutter={[16, 16]}>
                <Col lg={12} sm={24}>
                    <ProductImage detail={Product}/>
                </Col>
                <Col lg={12} sm={24}>
                    <ProductInfo detail={Product} />
                </Col>
            </Row>
    
        </div>
    )
}

export default DetailProductPage