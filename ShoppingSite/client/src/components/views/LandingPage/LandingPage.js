import React, {useEffect} from 'react'
import {FaCode} from 'react-icons/fa';
import axios from "axios"
import {Icon, Col, Card, Row, Carousel} from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import CheckBox from './Sections/CheckBox';
import {continents, price} from './Sections/Datas';
import RadioBox from './Sections/RadioBox';
import SearchFeature from './Sections/SearchFeature';


// 이미지 디자인은 ant 디자인의 carousel 이용
// 더보기 버튼을 위해 -> Limit & Skip 과 몽고DB이용

function LandingPage() {

    const [Products, setProducts] = useState([])  //여러 상품들이 들어가야 하므로
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)
    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })
    const [SearchTerm, setSearchTerm] = useState('')

    useEffect(() =>  {
        // request 보낼때 정보를 제한둬서 주기
        let body = {
            skip:Skip,
            limit: Limit
        }
        // 처음 페이지 들어왔을 경우 수행
        getProducts(body)
    }, [])

    const getProducts = (body) => {
        axios.post('/api/product/products')
            .then(response => {
                if(response.data.success){
                    // 더보기 버튼을 눌렀을 경우에는 원래 상품에다가 더해줘야 하므로
                    if(body.loadMore){ setProducts([...Products, ...response.data.productInfo ])}
                    else{ setProducts(response.data.productInfo)}
                    setPostSize(response.body.PostSize)

                }else{
                    alert('상품들을 가져오는데 실패했습니다');
                }
            })
    }

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

    // 더보기 버튼 클릭시 수행하는 함수 -> skip과 limit만 다르게해서 product 정보 불러오는것.
    const loadMoreHandler= () => {
        let skip = Skip + Limit;
        let body = {
            skip:Skip,
            limit: Limit,
            loadMore: true  // 더보기 버튼 눌렀을때 가는 정보인것을 표시
        }
        getProducts(body)
        setSkip(skip)
    }

    const showFilteredResults = (filters) => {

        // 새로운 바디 가져와서 getProduct 함수 실행, skip=0
        let body = {
            skip: 0,
            limit: Limit,
            filters: filters
        }
        getProducts(body)
        setSkip(0)
    }

    const handlePrice = (value) => {
        const data = price;
        let array = [];

        for(let key in data){
            if(data[key]._id === parseInt(value, 10)){
                array = data[key].array;
            }

            return array;
        }
    }

    const handleFilters = (filters, category) => {
        const newFilters = {...Filters}

        // continent 아니면 price를 나타내는것 
        newFilters[category] = filters

        // 카테고리가 price일땐 hanlePrice를 수행하도록함
        if(category=="price"){
            let priceValues=handlePrice(filters)
            newFilters[category]=priceValues
        }

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

    const updateSearchTerm = (newSearcTerm) => {

        let body = {
            skip: 0,
            limit: Limit,
            filters: Filters,
            searchTerm: newSearcTerm
        }

        setSkip(0)
        setSearchTerm(newSearcTerm)
        getProducts(body)
    }


    return (
        <div style={{width:'75%', margin: '3rem auto'}}>
        <div style={{ textAlign: 'center'}}>
            <h2>Let's Travel Anywhere <Icon type='rocket'/></h2>
        </div>

         {/* 필터부분, 여백을 위해 gutter 사용 */}
        <Row gutter={[16,16]}>
                <Col lg={12}  xs={24}>
                    {/* CheckBox */}
                    <CheckBox list={continents} handleFilters={filters => handleFilters(filters, "continents")}/>
                </Col>
                <Col lg={12} xs={24}>
                    {/* RadioBox */}
                    <RadioBox list={price} handleFilters={filters => handleFilters(filters, "price")}/>
                </Col>
        </Row>

        {/* 검색부분 */}
        <div style={{display: 'flex', justifyContent: 'flex-end', margin: '1rem auto'}}>
                <SearchFeature 
                    refreshFunction={updateSearchTerm}
                />
        </div>
         
         {/* 카드부분 */}
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
