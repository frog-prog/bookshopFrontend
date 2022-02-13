import React from 'react';
import style from './Order.module.scss';
import {OrderItem} from "../Orders/Orders";
import preloader from "../preloader.svg";

const Order: React.FunctionComponent<{
    OrderItem: OrderItem
}> = (props) => {
    const [changed, setChanged] = React.useState<boolean>(false)
    const [isFetching, setIsFetching] = React.useState<boolean>(false)
    const [mistake, setMistake] = React.useState<string>('')
    const [success, setSuccess] = React.useState<string>('')
    const sendRequest = (mode: 'com' | 'rej') => {
        setIsFetching(true);
        fetch('http://192.168.0.122:2000/order', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'Post',
            body: JSON.stringify({
                type: mode==='com' ? 'complete' : 'reject',
                id: props.OrderItem.id
            })
        }).then((result) => {
            return result.json()
        }).then((result) => {
            if (result.indexOf('fail') < 0) {
                setIsFetching(false)
                setSuccess(result[0])
                setChanged(true)
            } else {
                setIsFetching(false)
                setMistake(result[1])
            }
        })
    }

    return (
        <div className={style.or}>
            <div style={isFetching ? {display:'flex',minHeight:'50px',alignItems:'center'}:{display:'flex',minHeight:'50px',flexDirection:'column'}}>
                {isFetching ? <img src={preloader} style={{height: '50px'}}/> : null}
                <div className={style.mistake}>
                    {(mistake !== '' && !isFetching) ? JSON.stringify(mistake) : null}
                </div>
                <div className={style.success}>
                    {(success !== '' && !isFetching) ? success : null}
                </div>
            </div>
            <div className={style.param_Value}>
                <div className={style.param}>
                    &nbsp;Имя заказчика:
                </div>
                <div className={style.value}>
                &nbsp; {props.OrderItem.customer}
                </div>
            </div>
            <div className={style.param_Value}>
                <div className={style.param}>
                    &nbsp;Статус заказа:
                </div>
                <div className={style.value}>
                &nbsp; {props.OrderItem.status}
                </div>
            </div>
            <div className={style.param_Value}>
                <div className={style.param}>
                    &nbsp;Название книги:
                </div>
                <div className={style.value}>
                &nbsp; {props.OrderItem.book.name}
                </div>
                </div>
            <div className={style.param_Value}>
                <div className={style.param}>
                    &nbsp;Идентификатор книги:
                </div>
                <div className={style.value}>
                &nbsp; {props.OrderItem.book.id}
                </div>
                </div>
            {props.OrderItem.status === 'completed' ? null : <div className={style.buttonContainer}>
                <button className={style.sendButton}
                        onClick={(e)=>sendRequest('com')}
                        disabled={isFetching}
                >
                    Выполнено
                </button>
                <button className={style.delButton}
                        onClick={(e)=>sendRequest('rej')}
                        disabled={isFetching}
                >
                    Отказано
                </button>
            </div>}
            {changed ? <div className={style.delScreen}/> : null}
        </div>
    );
}

export default Order;
