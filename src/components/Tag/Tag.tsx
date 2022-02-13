import React from 'react';
import style from './Tag.module.scss'
type Item ={
    id:number
    name:string
}

const Tag: React.FunctionComponent<{
    text: Item
    clickFunc: (text: Item) => void
}> = (props) => {

    return (
        <div className={style.tag}>
            {props.text.name}
            <div className={style.tagCross} onClick={() => {props.clickFunc(props.text)}}>
                <div className={style.stick1}/>
                <div className={style.stick2}/>
            </div>
        </div>
    )
}
export default Tag