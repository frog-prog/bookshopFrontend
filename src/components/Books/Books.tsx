import React from "react";
import style from './Books.module.scss'
import SomeIdSearchComponent from "../SomeIdSearchComponent/SomeIdSearchComponent";
import NavBar from "../NavBar/NavBar";
import CommonForm from "../CommonForm/CommonForm";
import preloader from "../preloader.svg"

type Item={
    id: number,
    name: string
}
type Genre={
    bookId: number,
    genreId: number,
    genre: Item
}

type FullItem ={
    id: number,
    endAt: number,
    name: string,
    amount:number,
    pubYear: number,
    authorId: number,
    price: number,
    addressId: number,
    pubHouseId:number,
    author: Item,
    address: Item,
    pubHouse: Item,
    genres: Item[]
}
type RequestResult=[string,number,FullItem[]]

const BooksComponent:React.FunctionComponent=()=>{
    const [inputState,setInputState]=React.useState<Item|string>({id:-1,name:''})
    const [requestResult,setRequestResult]=React.useState<RequestResult>(['',0,[]])
    const [isFetching,setIsFetching]=React.useState<boolean>(false)
    const [sendMode,setSendMode]=React.useState<'name'|'id'|'genre'|'author'|'address'|'pubHouse'|string>('name')
    const [mistake,setMistake]=React.useState<string>('')
    const [page,setPage]=React.useState<number>(1)
    const inputTypeSelect=()=>{
        let requestType=''
        let label=''
        switch (sendMode){
            case 'id':
                if(typeof inputState==='string'){
                    return(<>
                            &nbsp;Идентификатор
                            <input type={'text'}
                                   value={inputState}
                                   onChange={(e) => {
                                       setInputState(e.currentTarget.value.replace(/[^0-9]/g, ''))
                                   }}
                                   className={style.input_notActive}
                            />
                        </>
                    )
                }
                break;
            case 'name':
                label='Название'
                requestType='book'
                break;
            case 'address':
                label='Адрес'
                requestType='address'
                break;
            case 'author':
                label='Автор'
                requestType='author'
                break;
            case 'genre':
                label='Жанр'
                requestType='genre'
                break;
            case 'pubHouse':
                label='Издательство'
                requestType='pubHouse'
                break;
        }
        if(typeof inputState!=="string"){
            return(<>
                &nbsp;{label}
                <SomeIdSearchComponent
                    realState={inputState.name}
                    handler={handler}
                    requestType={requestType}
                    fieldName={'name'}
                    addAbility={false}
                    id={-1}
                />
            </>)
        }
    }
    const handler=(field:string,value:Item)=>{
        setInputState(value)
    }
    const navBarHandler=(value:string)=>{
        if(value==='id'){
            setInputState('')
        }
        else{
            setInputState({id:-1,name:''})
        }
        setSendMode(value)
    }
    const send=(page:number)=>{
        setIsFetching(true)
        let a:string=''
        if(sendMode!=='name' && typeof inputState!=="string"){
            a=JSON.stringify({
                type:sendMode.toString(),
                id:Number(inputState.id),
                page:page
            })
        }
        if (typeof inputState !== "string" && sendMode==='name') {
            a = JSON.stringify({
                type: sendMode.toString(),
                name: inputState.name.toString(),
                page: page
            })
        }
        if(sendMode==='id' && typeof inputState==="string"){
            a=JSON.stringify({
                type:sendMode.toString(),
                id:Number(inputState),
                page:page
            })
        }
        fetch('http://192.168.0.122:2000/getBy', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'Post',
            body: a
        }).then((result) => {
            return result.json()
        }).then((result)=>{
            if(result.indexOf('fail')<0){
                let fullItems:FullItem[]=[]
                let temItem:FullItem
                setRequestResult(['',0,[]])
                for(let i=0;i<result[2].length;i++){
                    temItem={
                        id: result[2][i].id,
                        endAt: result[2][i].endAt,
                        name: result[2][i].name,
                        amount:result[2][i].amount,
                        pubYear: result[2][i].pubYear,
                        authorId: result[2][i].authorId,
                        price: result[2][i].price,
                        addressId: result[2][i].addressId,
                        pubHouseId:result[2][i].pubHouseId,
                        author: result[2][i].author,
                        address: result[2][i].address,
                        pubHouse: result[2][i].pubHouse,
                        genres: result[2][i].genres.map((item:Genre)=>item.genre)
                    }
                    fullItems.push(temItem)
                }
                result[2]=fullItems;
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
                {inputTypeSelect()}
                <div className={style.mistake}>
                    {mistake!=='' ? JSON.stringify(mistake):null}
                </div>
                <button onClick={(e)=>send(1)}
                        className={style.sendButton}
                        disabled={isFetching}
                >
                    Поиск
                </button>
                <NavBar currentState={sendMode}
                        handler={navBarHandler}
                        scheme={{
                            name:'Название',
                            id:'Идентификатор',
                            genre:'Жанр',
                            author:'Автор',
                            address:'Адрес',
                            pubHouse:'Издательство'
                        }}
                />

                <div className={style.resultContainer}>
                    {isFetching ? <img src={preloader} style={{width:'50%'}}/> : requestResult[2].map((item,idx)=>{
                            return (
                                <div key={idx} className={style.resultItem}>
                                    <CommonForm id={item.id}
                                                name={{id:-1,name:item.name}}
                                                endAt={item.endAt.toString()}
                                                addressId={item.address}
                                                authorId={item.author}
                                                genres={item.genres}
                                                price={item.price.toString()}
                                                amount={item.amount.toString()}
                                                pubHouse={item.pubHouse}
                                                pubYear={item.pubYear.toString()}
                                    />
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
export default BooksComponent
