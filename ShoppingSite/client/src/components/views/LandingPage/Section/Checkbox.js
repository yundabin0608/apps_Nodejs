import React, {useState} from 'react';
import {Collapse, Checkbox} from 'antd';

// ant디자인의 collapse 이용
const {Panel} = Collapse;  

// 나라들의 리스트를 인자 props로 받음
function CheckBox(props) {
    const [Checked, setChecked] = useState([])
    // 체크박스 선택시 체크한 항목 배열로 들어가는것임

    const handleToggle = (value) => {

        const currdentIndex = Checked.indexOf(value)
        const newChecked = [...Checked]

        // 누른것의 index 구하고 전체 checked state에서 현재 누른게 있다면 빼주고 없다면 state에 넣기
        if(currdentIndex === -1){  // indexof(존재X값) = -1 나옴
            newChecked.push(value)
        }else{
            newChecked.splice(currdentIndex, 1)
        }

        setChecked(newChecked)
        props.handleFilters(newChecked) 

    }

    const renderCheckboxLists = () => props.list && props.list.map((value, index) => (
        <React.Fragment key = {index}>
            <Checkbox onChange={() => handleToggle(value._id)} 
                checked={Checked.indexOf(value._id) === -1 ? false : true }/>
            <span>{value.name}</span>
        </React.Fragment>
    ))

    return (
        <div>
            <Collapse defaultActiveKey={['1']}>
                <Panel header="This is panel header 1" key="1">
                    {renderCheckboxLists()} 
                </Panel>
            </Collapse>
        </div>
    )
}

export default CheckBox