import React, {useState} from 'react'
import Dropzone from 'react-dropzone';
import {Icon} from 'antd';
import Axios from 'axios';

function FileUpload(props) {

    // 백에서 받아온 이미지를  확인 버튼 누르기 전에 담아둬야 하므로
    const [Images, setImages] = useState([])

    // 파일을 전달하고 백에서 저장하고 다시 프런트로 보여주어야 하므로
    const dropHandler = (files) => {

        // 파일 전송시 같이 보내줘야하는것(안보내면 에러), 올리는 파일에 대한 정보
        let formData = new FormData(); 
        const config = {
            header: {'content-type': 'multipart/form-data'}
        }
        formData.append("file", files[0]) 

        // 백쪽으로 전달 이 내용은 서버의
        Axios.post('/api/product/image', formData, config)
            .then(response => { 
                if(response.data.success){
                    console.log(response.data)
                    // 원래 있던 이미지들도 넣어야하니까 ...Images 
                    setImages([...Images, response.data.filePath])
                   
                    // 파일 정보들을 부모컴포넌트인 UploadProduct로 넘겨줘야 하므로
                    props.refreshFunction([...Images, response.data.filePath])
                }else{
                    alert("파일을 저장하는데 실패했습니다.")
                }

            })
    }

    // 이미지 지우기 (인덱스가 필요하므로 image 인자를 받음)
    const deleteHandler = (image) => { 
        const currentIndex = Images.indexOf(image) 

        // 여태까지 있는 이미지들에서 현재있는 사진만 잘라서 없애고 다시 setImage
        let newImages = [...Images]
        newImages.splice(currentIndex, 1) 
        setImages(newImages)
        
        // 파일 정보들을 부모컴포넌트인 UploadProduct로 넘겨줘야 하므로
        props.refreshFunction(newImages)
    }

    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            {/* onDrop을 통해 파일이 바뀐후 일어나는 동작 수행 dropHandler 이용*/}
            <Dropzone onDrop={dropHandler}>
                {({getRootProps, getInputProps}) =>(
                    <div   
                        style={{
                            width: 300, height:240, border: '1px solid lightgray',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        {...getRootProps()}>
                        <input {...getInputProps()}/>
                        <Icon type="plus" style={{fontSize:'3rem'}} />
                    </div>
                )}
            </Dropzone>

            <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll'}}>
                {Images.map((image, index) =>(
                    // index 넣어야 warning 안뜸
                    <div onClick={() => deleteHandler(image)} key={index}>
                        <img style={{minWidth: '300px', width: '300px', height: '240px'}}
                            src={`http://localhost:5000/${image}`} />
                        
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FileUpload
