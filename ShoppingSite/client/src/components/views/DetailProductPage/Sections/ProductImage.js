import React, {useEffect, useState} from 'react';
import ImageGallery from 'react-image-gallery';
// 이미지 슬라이딩과 전체화면을 보여주는 라이브러리

function ProductImage(props) {

    const [Images, setImages] = useState([])

    // props를 이용해 불러온 product의 모든 정보 이용 =>props.detail
    useEffect(() => {
        if(props.detail.images && props.detail.images.length > 0){
            let images = []

            // tip 썸네일을 만들땐 gm이란 모듈을 사용하면 편리함!
            props.detail.images.map(item => {
                images.push({
                    original: `http://localhost: 5000/${item}`,
                    thumbnail: `http://localhost:5000/${item}`
                })
            })
            setImages(images)
        }

    }, [props.detail])  // props.detail이 바뀔때마다 실행하도록
    
    // ImageGallery에 여러가지 이미지들을 정의 후 items 에 넣어주면 됨 이미지 스타일도 index.css에 정의함
    return (
        <div>
            <ImageGallery items={Images} />
        </div>
    )
}

export default ProductImage