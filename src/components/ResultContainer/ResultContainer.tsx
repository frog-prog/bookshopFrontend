import React from "react";
import style from './ResultContainer.module.scss'


const ResultContainer: React.FunctionComponent<{
    addedBook: {
        id: number,
        endAt: string,
        name: string,
        genres: string[],
        amount: string,
        author: string,
        price: string,
        address: string,
        pubHouse: string,
        pubYear: string
    },
}> = (props) => {
    let a = props.addedBook;
    if(a.id!==-1){
        return (
            <div className={style.RC}>
                <div className={style.row}>
                    <div className={style.left}>Идентификатор:</div>
                    <div className={style.id}>{a.id}</div>
                </div>
                <div className={style.row}>
                    <div className={style.left}>Название:</div>
                    <div className={style.right}>{a.name}</div>
                </div>
                <div className={style.row}>
                    <div className={style.left}>Жанры:</div>
                    <div className={style.right}>{a.genres.map((item,idx) => (<div key={idx} className={style.genre}>{item}</div>))}</div>
                </div>
                <div className={style.row}>
                    <div className={style.left}>Автор:</div>
                    <div className={style.right}>{a.author}</div>
                </div>
                <div className={style.row}>
                    <div className={style.left}>Издательство:</div>
                    <div className={style.right}>{a.pubHouse}</div>
                </div>
                <div className={style.row}>
                    <div className={style.left}>Количество:</div>
                    <div className={style.right}>{a.amount}&nbsp;шт.</div>
                </div>
                <div className={style.row}>
                    <div className={style.left}>Срок хранения:</div>
                    <div className={style.right}>{a.endAt}&nbsp;дней</div>
                </div>
                <div className={style.row}>
                    <div className={style.left}>Цена:</div>
                    <div className={style.right}>{a.price}&nbsp;руб.</div>
                </div>
                <div className={style.row}>
                    <div className={style.left}>Год издания:</div>
                    <div className={style.right}>{a.pubYear}&nbsp;г.</div>
                </div>
                <div className={style.row}>
                    <div className={style.left}>Адрес:</div>
                    <div className={style.right}>{a.address}</div>
                </div>
            </div>
        )
    }
    else {
     return null
    }
}
export default ResultContainer