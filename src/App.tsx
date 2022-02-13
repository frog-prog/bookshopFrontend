import React, {useState} from 'react';
import style from './App.module.scss';
import CommonForm from "./components/CommonForm/CommonForm";
import NavBar from "./components/NavBar/NavBar";
import BooksComponent from "./components/Books/Books";
import Orders from "./components/Orders/Orders";

function App() {
    const [workPlace,setWorkPlace]=useState<'ADD'|'ORDERS'|'BOOKS'|string>('ADD')
    const childRendFunc=()=>{
        switch (workPlace){
            case 'ADD': return (<CommonForm id={-1}
                                            name={{id:-1,name:''}}
                                            endAt={'30'}
                                            addressId={{id:-1,name:''}}
                                            authorId={{id:-1,name:''}}
                                            genres={[]} price={''}
                                            amount={''}
                                            pubHouse={{id:-1,name:''}}
                                            pubYear={''}
            />)
            case 'BOOKS':return (<BooksComponent/>)
            case 'ORDERS': return (<Orders/>)
        }
    }
  return (
    <div className={style.App}>
        <NavBar currentState={workPlace}
                handler={setWorkPlace}
                scheme={{
                    ADD:'Добавление',
                    ORDERS:'Заказы',
                    BOOKS:'Книги'
                }}
        />
        {childRendFunc()}
    </div>
  );
}

export default App;
