import React from 'react';
import style from './NavBar.module.scss';

const NavBar: React.FunctionComponent<{
    handler: (mode:string) => void
    currentState:string
    scheme:{
        [key:string]:string
    }
}> = (props) => {

    const buttonOutput=()=>{
        let arr=[]
        let i=0;
        for (let key in props.scheme){
            arr.push(<div key={i} className={styleFunc()[i]} style={widthSelect()} onClick={()=>props.handler(key)}>{props.scheme[key]}</div>)
            i++;
        }
        return arr
    }
    const styleFunc=()=>{
        let arr=[]
        for (let key in props.scheme){
            if(key===props.currentState){
                arr.push(style.navButton_active)
            }
            else{
                arr.push(style.navButton)
            }
        }
        return arr
    }
    const widthSelect=()=>{
        let i=0;
        for (let key in props.scheme){
            i++;
        }
        return {width:Math.floor(100/(i)).toString()+'%'}
    }

    return (
            <div className={style.navButtons}>
                {buttonOutput()}
            </div>
    );
}

export default NavBar;
