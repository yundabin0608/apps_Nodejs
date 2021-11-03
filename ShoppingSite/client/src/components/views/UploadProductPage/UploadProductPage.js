import React, {useState} from 'react'
import {Typography, Button, Form, Input} from 'antd';
import FileUpload from '../../utils/FileUploads';
import Axios from 'axios';

const {TextArea} = Input;

// 대륙 object 형식으로 만들어서 select시 map 이용
const Continents = [
    {key: 1, value: "Africa"},
    {key: 2, value: "Europe"},
    {key: 3, value: "Asia"},
    {key: 4, value: "North America"},
    {key: 5, value: "South America"},
    {key: 6, value: "Australia"},
    {key: 7, value: "Antarctica"}
]

function UploadProductPage(props) {

    const [Title, setTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Price, setPrice] = useState(0)
    const [Continent, setContinent] = useState(1)
    const [Images, setImages] = useState([])

    const titleChangeHandler = (event) => {
        setTitle(event.currentTarget.value)
    }

    const descriptionChangeHandler = (event) => {
        setDescription(event.currentTarget.value)
    }

    const priceChangeHandler = (event) => {
        setPrice(event.currentTarget.value)
    }

    const continentChangeHandler = (event) => {
        setContinent(event.currentTarget.value)
    }


    const updateImages = (newImages) => {
        setImages(newImages) 
    }

    const submitHandler = (event) => {
        // 확인버튼 누를때 자동으로 페이지 업데이트 되지 않게 하기 위해 사용
        event.preventDefault(); 

        // 모두 채워지지 않을경우 alert
        if(!Title || !Description || !Price | !Continent || !Images){
            return alert("모든 값을 넣어주셔야 합니다.")
        }

        // 서버에 값들을 request로 보냄
        const body={
            // hook의 auth를 보면 props를 이용해 정보를 넣어준것이므로 uploadproductpage가 자식컴포넌트 된것이므로 props 사용
            writer: props.user.userData._id,
            title: Title,
            description: Description,
            price: Price,
            images: Images,
            continents: Continent
        }

        // 백으로 전달
        Axios.post('/api/product', body) 
            .then(response => {
                if(response.data.success){ 
                    alert("상품 업로드에 성공했습니다.")
                    // 성공 후 메인 페이지로 가기위해
                    props.history.push('/')
                }
                else{
                    alert("상품 업로드에 실패했습니다.")
                }
            })
    }

    return (
        <div style={{ maxWidth:'700px', margin:'2rem auto'}}>
            <div style={{ textAlign: 'center', marginBottom: '2rem'}}>
                <h2>여행 상품 업로드</h2>
            </div>

            <Form onSubmit={submitHandler}>
                {/* 이미지 업로드시 fileUpload의 이미지 주소를 받을것 */}
                <FileUpload refreshFunction={updateImages}/>
                
                <br/>
                <br/>
                <label>이름</label>
                {/* 입력 들어갈때마다 변화하는것을 보여주기 위해 onChange에 titleChangeHandler  */}
                <Input 
                    onChange={titleChangeHandler} 
                    value={Title}/>  
                <br/>
                <br/>
                <label>설명</label>
                <TextArea 
                    onChange={descriptionChangeHandler} 
                    value={Description}/>
                <br/>
                <br/>
                <label>가격($)</label>
                <Input 
                    type="number"
                    onChange={priceChangeHandler}
                    value={Price}/>
                <br/>
                <br/>
                {/* ?? 왜..지 왜 나라는 안바뀌니 */}
                <select onChange={continentChangeHandler} value={Continent} >
                    {Continents.map(item =>(
                        <option key={item.key} value={Continent}>{item.value}</option>
                    ))}
                    
                </select>
                <br/>
                <br/>
                <Button type="submit">
                    확인
                </Button>
            </Form>
            
        </div>
    )
}

export default UploadProductPage
