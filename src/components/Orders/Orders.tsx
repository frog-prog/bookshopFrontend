import React from "react";
import style from './Orders.module.scss'
import preloader from "../preloader.svg"
import Order from "../Order/Order";



export type OrderItem ={
    id: number,
    bookId: number,
    status: string,
    customer: string,
    book: {
        id: number,
        endAt: number,
        name: string,
        amount: number,
        pubYear: number,
        authorId: number,
        price: number,
        addressId: number,
        pubHouseId: number
    }
}
type RequestResult=[string,number,OrderItem[]]
const Orders:React.FunctionComponent=()=>{
    const [inputState,setInputState]=React.useState<string>('')
    const [requestResult,setRequestResult]=React.useState<RequestResult>(['',0,[]])
    const [isFetching,setIsFetching]=React.useState<boolean>(false)
    const [mistake,setMistake]=React.useState<string>('')
    const [page,setPage]=React.useState<number>(1)


    const send=(page:number)=>{
        setIsFetching(true)
        fetch('http://192.168.0.122:2000/order', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'Post',
            body: JSON.stringify({
                type:"search",
                name:inputState,
                page:page
            })
        }).then((result) => {
            return result.json()
        }).then((result)=>{
            if(result.indexOf('fail')<0){

                setIsFetching(false)
                setRequestResult(result)
            }
            else{
                setIsFetching(false)
                setMistake(result[1])
            }
        })
    }

    return (
        <div className={style.bc}>
            &nbsp;Имя заказчика
            <input type={'text'}
                   value={inputState}
                   onChange={(e) => {
                       setInputState(e.currentTarget.value)
                   }}
                   className={style.input_notActive}
            />
            <div className={style.mistake}>
                {mistake!=='' ? JSON.stringify(mistake):null}
            </div>
            <button onClick={(e)=>send(1)}
                    className={style.sendButton}
                    disabled={isFetching}
            >
                Поиск
            </button>
            <div className={style.resultContainer}>
                {isFetching ? <img src={preloader} style={{width:'50%'}}/> : requestResult[2].map((item,idx)=>{
                    return (
                        <div key={idx} className={style.resultItem}>
                            <Order OrderItem={item}/>
                        </div>
                    )
                })}
            </div>
            {requestResult[1]>1 ? (<><div className={style.navigation}>
                <button className={page===1 ? style.pagButton_notActive : style.pagButton_active}
                        disabled={page===1}
                        onClick={(e)=>{
                            let p=page-1;
                            setPage(p);
                            send(p)
                        }}
                >
                    Назад
                </button>
                {page+'/'+requestResult[1]}
                <button className={page===requestResult[1] ? style.pagButton_notActive : style.pagButton_active}
                        disabled={page===requestResult[1]}
                        onClick={(e)=>{
                            let p=page+1;
                            setPage(p);
                            send(p)
                        }}
                >
                    Вперед
                </button>
            </div><div style={{height:'100px'}}/></>) : null}

        </div>
    )
}
export default Orders
