import React from 'react';
import style from './SearchResultsContainer.module.scss'
import SearchRow from './SearchRow/SearchRow'
type Item ={
    id:number
    name:string
}

const SearchResultsContainer:React.FunctionComponent<{
    results:Item[],
    isFetching:boolean,
    inputRef:React.RefObject<HTMLInputElement>,
    requestType:string,
    addAbility:boolean,
    text:string,
    isNulled:boolean
    clickFunc:(text:Item)=>void
    inputMode:number
}>=(props)=>{
    const [isFetching,setIsFetching]=React.useState<boolean>(false);

    const upload=()=>{
        setIsFetching(true)
        fetch('http://192.168.0.122:2000/add', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'Post',
            body: JSON.stringify({
                "type": props.requestType,
                "name": props.text
            })
        }).then((result)=>{
            return result.json()
        }).then((result:any[])=>{
            if(result.indexOf('fail')<0){
                console.log(result[1])
                props.clickFunc(result[1])
            }
            setIsFetching(false)
        })
    }
    if(props.results.length===0 && props.text.length>0 && props.addAbility && !props.isNulled && props.inputMode===0){
            if(props.isFetching || isFetching){
                return <div className={style.SRC}>
                    <SearchRow text={{id:0,name:'Loading...'}}
                               clickFunc={()=>{return}}
                    />
                </div>
            }
            else {
                return <div className={style.SRC}>
                    <SearchRow text={{id:0,name:'Добавить'}}
                               clickFunc={upload}
                    />
                </div>
            }
    }
    else{
        return <div className={style.SRC}>
            {props.results.map((item,idx)=>{
                return <SearchRow key={idx}
                                  text={item}
                                  clickFunc={props.clickFunc}
                />
            })}
        </div>
    }
}
export default SearchResultsContainer