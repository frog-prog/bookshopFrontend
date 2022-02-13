import React from "react";
import style from './SomeIdSearchComponent.module.scss';
import SearchResultsContainer from "../SearchResultsContainer/SearchResultsContainer";
import {FormState} from "../CommonForm/CommonForm";
type Item ={
    id:number
    name:string
}

const SomeIdSearchComponent: React.FunctionComponent<{
    handler: ((field: keyof FormState, value: Item) => void) | ((field:string,value:Item)=> void)
    realState: string|Item[]
    requestType:string
    fieldName:keyof FormState
    addAbility:boolean
    id:number
}> = (props) => {

    const [requestResult, setRequestResult] = React.useState<Item[]>([]);
    const [isFetching, setIsFetching] = React.useState<boolean>(false);
    const [isNulled,setIsNulled]=React.useState<boolean>(false)
    const [inputState,setInputState]=React.useState<string>('')
    const [inputMode,setInputMode]=React.useState<number>(props.id)
    const inputRef=React.useRef<HTMLInputElement>(null)
    let buffer:Item[];
    let found:boolean
    const clickFunc=(name:Item)=>{
        props.handler(props.fieldName,name)
        if(typeof props.realState!=='string'){
            setRequestResult([])
            setIsNulled(true)
            setInputState('')
        }
        else{
            setRequestResult([])
            setIsNulled(true)
        }
    }
    let input:string;
    if(typeof props.realState==='string'){
        input=props.realState
    }
    else{
        input=inputState
    }
    const inputReaction = (event: React.FormEvent<HTMLInputElement>) => {
        if(inputMode>0 || inputMode===-1){
            setInputMode(0);
        }
        setIsNulled(false);
        if(typeof props.realState==='string'){
            props.handler(props.fieldName, {id:-1,name:event.currentTarget.value});
        }
        else{
            setInputState(event.currentTarget.value)
        }
        if (event.currentTarget.value !== '') {
            let value = event.currentTarget.value;
            value = value.replace(/\s+/g, ' ').trim()
            value = value[0].toUpperCase() + value.slice(1)
            setIsFetching(true);
            fetch('http://192.168.0.122:2000/search', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'Post',
                body: JSON.stringify({
                    "type": props.requestType,
                    "searchRequest": value
                })
            }).then((response) => {
                return response.json()
            }).then((result) => {
                setIsFetching(false)
                if (result.indexOf('fail')<0) {
                    if(typeof props.realState!=='string'){
                        buffer = [];
                        found = false;
                        for (let i = 0; i < result[1].length; i++) {
                            for (let j = 0; j < props.realState.length; j++) {
                                if (result[1][i].id === props.realState[j].id) {
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                buffer.push(result[1][i])
                            }
                            found = false
                        }
                        setRequestResult(buffer)
                    }
                    else{
                        setRequestResult(result[1])
                    }
                }
            })
        }
        else{
            setRequestResult([])
        }
    }
    return <div className={style.NSC}>
        <input ref={inputRef}
               type={"text"}
               value={input}
               onChange={(e) => {
                   inputReaction(e)
               }}
               onKeyUp={(e)=>{if(e.code==="Enter"){setRequestResult([])}}}
               className={style.input_notActive}
        />
        <SearchResultsContainer
            results={requestResult}
            text={input}
            isFetching={isFetching}
            addAbility={props.addAbility}
            clickFunc={clickFunc}
            inputRef={inputRef}
            requestType={props.requestType}
            isNulled={isNulled}
            inputMode={inputMode}
        />
    </div>
}
export default SomeIdSearchComponent