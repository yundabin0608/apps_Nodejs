import React, {useEffect} from 'react'
import {FaCode} from 'react-icons/fa';
import axios from "axios"
import {Icon, Col, Card, Row, Carousel} from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import {continents} from './Sections/Datas';
// 이미지 디자인은 ant 디자인의 carousel 이용


function LandingPage() {

    const [Products, setProducts] = useState([])  //여러 상품들이 들어가야 하므로

    useEffect(() => {
        
        axios.post('/api/product/products')
        .then(res=>{
            if(res.data.success){
                setProducts([...Products, ...response.data.productInfo ])
            }else{
                alert("상품들을 가져오는데 실패했습니다.")
            }
        })
    }, [])

    // Product에서 상품 하나하나 가져와서 카드로.
    // 화면크기별 반응형 웹 => 가로가 24인데 클땐 6*4=24, 작을땐 24*1=24
    const renderCards = Products.map((product, index) => {
        return  <Col lg={6} md={8} xs={24} key={index}>
            <Card cover={<ImageSlider images={product.images} />}>
                <Meta
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })



    return (
        <div style={{width:'75%', margin: '3rem auto'}}>
        <div style={{ textAlign: 'center'}}>
            <h2>Let's Travel Anywhere <Icon type='rocket'/></h2>
        </div>

         {/* Filter */}


         {/* CheckBox */}
             <CheckBox list={continents} handleFilters={filters => handleFilters(filters, "continents")}/>

         {/* RadioBox */}

         {/* 여백을 위해 gutter 사용 */}
         <Row gutter={[16, 16]}>
         {renderCards}
         </Row>

         <br />

         {PostSize >= Limit &&
             <div style={{display: 'flex', justifyContent: 'center'}}>
             <button onClick={loadMoreHandler}>더보기</button>
         </div>
         }   
    </div>
    )
}

export default LandingPage
