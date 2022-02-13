import React from "react";
import style from './CommonForm.module.scss'
import SomeIdSearchComponent from '../SomeIdSearchComponent/SomeIdSearchComponent'
import Tag from "../Tag/Tag";
import ResultContainer from "../ResultContainer/ResultContainer";
import preloader from "../preloader.svg"

type Item = {
    id: number
    name: string
}

export type FormProps = {
    id: number,
    name: Item,
    endAt: string,
    addressId: Item,
    authorId: Item,
    genres: Item[],
    price: string,
    amount: string,
    pubHouse: Item,
    pubYear: string,
}
export type Genre = {
    bookId: number,
    genreId: number,
    genre: {
        id: number,
        name: string
    }
}
export type FormState = {
    name: Item,
    endAt: string,
    addressId: Item,
    authorId: Item,
    genres: Item[],
    price: string,
    amount: string,
    pubHouse: Item,
    pubYear: string,
    isFetching: boolean,
    addedBook: {
        id: number,
        endAt: string,
        name: string,
        amount: string,
        pubYear: string,
        price: string,
        author: string,
        address: string,
        pubHouse: string,
        genres: string[]
    },
    mistake: string,
    success: string,
    deleted: boolean,
    updateAplied: boolean,
    orderFIO: string
}
export default class CommonForm extends React.Component<FormProps, FormState> {
    state: FormState = {
        name: this.props.name,
        endAt: this.props.endAt,
        addressId: this.props.addressId,
        authorId: this.props.authorId,
        genres: this.props.genres,
        price: this.props.price,
        amount: this.props.amount,
        pubHouse: this.props.pubHouse,
        pubYear: this.props.pubYear,
        isFetching: false,
        addedBook: {
            id: -1,
            endAt: '',
            name: "",
            amount: '',
            pubYear: '',
            price: '',
            author: "",
            address: "",
            pubHouse: "",
            genres: []
        },
        mistake: '',
        success: '',
        deleted: false,
        updateAplied: true,
        orderFIO: ''
    };

    setField = (field: keyof FormState, value: Item | string) => {
        let buffer = this.state[field];
        if (Array.isArray(buffer) && typeof value !== 'string') {
            buffer.push(value)
        } else {
            buffer = value
        }
        this.setState(() => ({
            [field]: buffer,
            updateAplied: false
        } as Pick<FormState, keyof FormState>), () => {
            console.log(this.state)
        })
    }
    delGenre = (text: Item) => {
        let value: Item[] = this.state.genres;
        value = value.filter((item) => item.id !== text.id)
        console.log(value)
        this.setState({genres: value})
    }
    add = () => {
        if (this.state.name.name.length > 0 &&
            this.state.pubYear.length > 3 &&
            this.state.price.length !== 0 &&
            this.state.amount.length !== 0 &&
            this.state.endAt.length !== 0 &&
            this.state.genres.length > 0 &&
            this.state.addressId.id !== -1 &&
            this.state.authorId.id !== -1 &&
            this.state.pubHouse.id !== -1
        ) {
            console.log('work')
            let a = JSON.stringify({
                type: "book",
                endAt: Math.floor(Date.now() / 1000 / 3600 / 24 + Number(this.state.endAt)),
                name: this.state.name.name,
                genres: this.state.genres.map((item) => item.id),
                amount: Number(this.state.amount),
                authorId: Number(this.state.authorId.id),
                price: Number(this.state.price),
                addressId: Number(this.state.addressId.id),
                pubHouse: Number(this.state.pubHouse.id),
                pubYear: Number(this.state.pubYear)
            })
            console.log(a);
            this.setState({isFetching: true, success: '', mistake: ''}, () => {
                fetch('http://192.168.0.122:2000/add', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'Post',
                    body: a
                }).then((result) => {
                    return result.json()
                }).then((result) => {
                    if (result.indexOf('fail') < 0) {
                        this.setState({
                            name: {id: -1, name: ''},
                            endAt: '30',
                            addressId: {id: -1, name: ''},
                            authorId: {id: -1, name: ''},
                            genres: [],
                            price: '',
                            amount: '',
                            pubHouse: {id: -1, name: ''},
                            pubYear: '',
                            addedBook: {
                                id: result[1].id,
                                endAt: result[1].endAt,
                                name: result[1].name,
                                amount: result[1].amount,
                                pubYear: result[1].pubYear,
                                price: result[1].price,
                                author: result[1].author.name,
                                address: result[1].address.name,
                                pubHouse: result[1].pubHouse.name,
                                genres: result[1].genres.map((item: Genre) => {
                                    return item.genre.name
                                })
                            },
                            isFetching: false,
                            mistake: '',
                            success: result[0]
                        })
                    } else {
                        this.setState({
                            name: {id: -1, name: ''},
                            endAt: '30',
                            addressId: {id: -1, name: ''},
                            authorId: {id: -1, name: ''},
                            genres: [],
                            price: '',
                            amount: '',
                            pubHouse: {id: -1, name: ''},
                            pubYear: '',
                            mistake: result[1].toString(),
                            isFetching: false,
                            addedBook: {
                                id: -1,
                                endAt: '',
                                name: "",
                                amount: '',
                                pubYear: '',
                                price: '',
                                author: "",
                                address: "",
                                pubHouse: "",
                                genres: []
                            },
                            success: ''
                        })
                    }
                })
            })
        } else {
            this.setState({
                mistake: "Не все поля заполнены",
                success: '',
            })
        }
    }
    update = () => {
        if (this.state.name.name.length > 0 &&
            this.state.pubYear.length > 3 &&
            this.state.price.length !== 0 &&
            this.state.amount.length !== 0 &&
            this.state.endAt.length !== 0 &&
            this.state.genres.length > 0 &&
            this.state.addressId.id !== -1 &&
            this.state.authorId.id !== -1 &&
            this.state.pubHouse.id !== -1) {
            let a = JSON.stringify({
                type: "book",
                id: this.props.id,
                endAt: Math.floor(Date.now() / 1000 / 3600 / 24 + Number(this.state.endAt)),
                name: this.state.name.name,
                genres: this.state.genres.map((item) => item.id),
                amount: Number(this.state.amount),
                authorId: Number(this.state.authorId.id),
                price: Number(this.state.price),
                addressId: Number(this.state.addressId.id),
                pubHouse: Number(this.state.pubHouse.id),
                pubYear: Number(this.state.pubYear)
            })
            this.setState({isFetching: true, success: '', mistake: ''}, () => {
                fetch('http://192.168.0.122:2000/update', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'Post',
                    body: a
                }).then((result) => {
                    return result.json()
                }).then((result) => {
                    if (result.indexOf('fail') < 0) {
                        this.setState({
                            isFetching: false,
                            updateAplied: true,
                            success: result[0]
                        })
                    } else {
                        this.setState({
                            isFetching: false,
                            updateAplied: false,
                            mistake: result[1].toString()
                        })
                    }
                })
            })
        } else {
            this.setState({
                mistake: "Не все поля заполнены",
                success:''
            })
        }
    }
    delete = () => {
        this.setState({isFetching:true,mistake:'',success:''},()=>{
            fetch('http://192.168.0.122:2000/remove/book/' + this.props.id).then((result) => {
                return result.json()
            }).then((result) => {
                if (result.indexOf('fail') < 0) {
                    if (result[2] === 'updated') {
                        this.setState({amount: result[1].amount,isFetching:false,mistake:'',success:''})
                    }
                    if (result[2] === 'deleted') {
                        this.setState({deleted: true,isFetching:false,mistake:'',success:''})
                    }
                } else {
                    this.setState({mistake: result[1],success:'',isFetching:false})
                }
            })
        })
    }
    addOrder=()=>{
        if(this.state.orderFIO!==''){
            this.setState({isFetching:true,mistake:'',success:''},()=>{
                fetch('http://192.168.0.122:2000/order', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'Post',
                    body: JSON.stringify({type:"add",id:this.props.id,name:this.state.orderFIO})
                }).then((result)=>{
                    return result.json()
                }).then((result)=>{
                    if(result.indexOf('fail')<0){
                        this.setState({isFetching:false,success:result[0],orderFIO:'',mistake:''})
                    }
                    else{
                        this.setState({isFetching:false,mistake:result[1].toString(),success:''})
                    }
                })
            })
        }
        else{
            this.setState({mistake:'Имя не вписано',success:''})
        }
    }

    render() {
        return (
            <div className={style.sf}>
                <div style={this.state.isFetching ? {display:'flex',minHeight:'50px',alignItems:'center'}:{display:'flex',minHeight:'50px',flexDirection:'column'}}>
                    &nbsp;Название&nbsp;
                    {this.state.isFetching ? <img src={preloader} style={{height: '50px'}}/> : null}
                    <div className={style.mistake}>
                        {(this.state.mistake !== '' && !this.state.isFetching) ? JSON.stringify(this.state.mistake) : null}
                    </div>
                    <div className={style.success}>
                        {(this.state.success !== '' && !this.state.isFetching) ? this.state.success : null}
                    </div>
                    {this.state.deleted ? <div style={{color: '#ff0000'}}>&nbsp;Удалено</div> : null}
                </div>
                <SomeIdSearchComponent
                    realState={this.state.name.name}
                    handler={this.setField}
                    requestType={'book'}
                    fieldName={'name'}
                    addAbility={false}
                    id={this.props.id}
                />
                &nbsp;Автор
                <SomeIdSearchComponent
                    realState={this.state.authorId.name}
                    handler={this.setField}
                    requestType={'author'}
                    fieldName={'authorId'}
                    addAbility={true}
                    id={this.props.id}
                />
                &nbsp;Жанры
                <div className={style.tagContainer}>
                    {this.state.genres.map((item,idx) => <Tag text={item} key={idx} clickFunc={this.delGenre}/>)}
                </div>
                <SomeIdSearchComponent
                    realState={this.state.genres}
                    handler={this.setField}
                    requestType={'genre'}
                    fieldName={'genres'}
                    addAbility={true}
                    id={this.props.id}
                />
                &nbsp;Адрес
                <SomeIdSearchComponent
                    realState={this.state.addressId.name}
                    handler={this.setField}
                    requestType={'address'}
                    fieldName={'addressId'}
                    addAbility={true}
                    id={this.props.id}
                />
                &nbsp;Издательство
                <SomeIdSearchComponent
                    realState={this.state.pubHouse.name}
                    handler={this.setField}
                    requestType={'pubHouse'}
                    fieldName={'pubHouse'}
                    addAbility={true}
                    id={this.props.id}
                />
                &nbsp;Год издания
                <input type={'text'}
                       value={this.state.pubYear}
                       onChange={(e) => {
                           this.setField('pubYear', e.currentTarget.value.replace(/[^0-9]/g, ''))
                       }}
                       className={style.input_notActive}
                />
                &nbsp;Цена
                <input type={'text'}
                       value={this.state.price}
                       onChange={(e) => {
                           this.setField('price', e.currentTarget.value.replace(/[^0-9]/g, ''))
                       }}
                       className={style.input_notActive}
                />
                &nbsp;Количество
                <input type={'text'}
                       value={this.state.amount}
                       onChange={(e) => {
                           this.setField('amount', e.currentTarget.value.replace(/[^0-9]/g, ''))
                       }}
                       disabled={this.props.id > -1}
                       className={style.input_notActive}
                />
                {(this.props.id > -1 && !this.state.deleted) ? (<button className={style.plusButton}
                                                                        onClick={() => {
                                                                            this.setField('amount', (Number(this.state.amount) + 1).toString());
                                                                            console.log('work')
                                                                        }}
                                                                        disabled={this.state.isFetching}
                >
                    +
                </button>) : null}
                &nbsp;Срок
                <input type={'text'}
                       value={this.state.endAt}
                       style={(Number(this.state.endAt) < 10 && this.props.id !== -1) ? {color: '#FF0000'} : {color: '#000000'}}
                       onChange={(e) => {
                           this.setField('endAt', e.currentTarget.value.replace(/[^0-9]/g, ''))
                       }}
                       className={style.input_notActive}
                />

                <div className={style.buttonContainer}>
                    <button onClick={(e) => (this.props.id === -1) ? this.add() : this.update()}
                            className={style.sendButton}
                            disabled={this.state.isFetching}
                    >
                        {this.props.id === -1 ? 'Добавить' : 'Изменить'}
                    </button>
                    {(this.props.id !== -1 && !this.state.deleted) ? (<button onClick={this.delete}
                                                                              className={style.delButton}
                                                                              style={this.state.isFetching || !this.state.updateAplied ? {backgroundColor: '#5d5a5a'} : {backgroundColor: '#ec2929'}}
                                                                              disabled={this.state.isFetching || !this.state.updateAplied}>
                        Удалить
                    </button>) : null}
                </div>
                {this.props.id>-1 ? (<>&nbsp;Добавление заказа
                    <div className={style.addOrderContainer}>
                        &nbsp;ФИО заказчика
                        <input type={'text'}
                               value={this.state.orderFIO}
                               onChange={(e) => this.setState({orderFIO: e.currentTarget.value})}
                               className={style.input_notActive}
                        />
                        <button className={style.sendButton}
                                onClick={this.addOrder}
                                disabled={this.state.isFetching || !this.state.updateAplied}
                        >
                            Добавить заказ
                        </button>
                    </div></>):null}

                <ResultContainer addedBook={this.state.addedBook}/>
                {this.props.id===-1 ? <div style={{height: '100px'}}/> : null}
                {this.state.deleted ? <div className={style.delScreen}/> : null}
            </div>
        )
    }
}