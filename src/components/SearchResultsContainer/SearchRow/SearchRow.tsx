import React from 'react';
import style from './SearchRow.module.scss'
type Item ={
    id:number
    name:string
}

const SearchRow: React.FunctionComponent<{
    text: Item
    clickFunc: (text: Item) => void
}> = (props) => {
    console.log(props.text)
    return (
        <div className={style.SR}
             onClick={() => {
                props.clickFunc(props.text)
             }}
        >
            {props.text.name}
        </div>
    )
}
export default SearchRow