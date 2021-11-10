import React from 'react';
import {Icon, Col, Card, Row, Carousel} from 'antd';

// 이미지를 인자로 받고 그 여러 이미지를 map으로 표현
function ImageSlider(props) {
    return (
        <div>
            {/* 자동으로 사진전환 위해 autoplay 옵션 수행 */}
            <Carousel autoplay>
                {props.images.map((image, index) => (
                    <div key={index}>
                        <img style={{width: '100%', maxHeight: '150px'}} 
                            src={`http://localhost:5000/${image}`}
                        />
                    </div>
                ))}
            </Carousel>
        </div>
    )
}
export default ImageSlider