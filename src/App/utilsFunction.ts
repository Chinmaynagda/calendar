import { hourBoxStyle, todoType } from "../types";

const colorType = (str:string)=>{
    const STR = str.toUpperCase();
    if(STR === 'PERSONAL') return 'rgb(255, 46, 46,0.8)'
    else if(STR === 'WORK') return 'rgb(62, 238, 229,0.8)'
    else return 'rgb(66, 189, 238,0.8)';
}

function formatTime(time:string){
    const hr = parseInt(time.split(':')[0])
    const mm = parseInt(time.split(':')[1])
    if(hr === 0){
        return `12:${mm.toString().padStart(2,'0')} AM`
    }else if(hr<12){
        return `${hr.toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')} AM`
    }else if(hr===12){
        return `12:${mm.toString().padStart(2,'0')} PM`
    }else {
        const hrr= hr - 12;
        return `${hrr.toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')} PM`
    }
}

function getValuesByDate(targetDate: Date,todos:Array<todoType>) {
    const values:Array<todoType> = []; 
    const dateStr = targetDate.toLocaleDateString('en-US',{
        year: 'numeric',
        month: 'numeric', 
        day: 'numeric' 
}
);
    todos.forEach((todo)=>{
        if(todo.date === dateStr) values.push(todo)
    }
    )
    return values;
  }

  function retColor(hr: number,values:Array<todoType>) {
    let clr = 'transparent';
    values.forEach((item) => {
        const st = parseInt(item.startTime.split(':')[0]);
        const et = parseInt(item.endTime.split(':')[0]);
        if (st <= hr && hr <= et) {
            clr = colorType(item.type)
            return clr;
        }
    })
    return clr;
}


function retBoxType(hr: number,values:Array<todoType>){
    let boxType:hourBoxStyle = {
        marginTop:'0',
        height:'100%',
        backgroundColor:'transparent'
    };
    values.forEach((item) => {
        const st = item.startTime.split(':');
        const et = item.endTime.split(':');

        const st_h = parseInt(st[0]);
        const st_m = Math.round((parseInt(st[1])/60)*100);

        const et_h = parseInt(et[0]);
        const et_m = Math.round((parseInt(et[1])/60)*100);
        const marginTop = Math.round(((100-st_m)/10));
        
        if(hr>st_h && hr<et_h) boxType ={
            marginTop:'0',
            height:'100%',
            backgroundColor: colorType(item.type)
        }
        else if(hr === st_h && st_m===0) boxType={
            marginTop:'0',
            height:'100%',
            backgroundColor: colorType(item.type)  
        }

        else if(hr===st_h ) boxType ={
            marginTop:`${marginTop}vh`,
            height:`${st_m}%`,
            backgroundColor: colorType(item.type)
        }
        else if(hr===et_h) boxType ={
            marginTop:'0',
            height:`${et_m}%`,
            backgroundColor: colorType(item.type)
        }
        
    })
    return boxType;
}



function retText(hr: number,values:Array<todoType>) {
    let txt = '';
    values.forEach((item) => {
    const st = parseInt(item.startTime.split(':')[0]);
    const et = parseInt(item.endTime.split(':')[0]);
        if (hr===Math.floor((st+et)/2)) {
            txt = item.title;
            return txt;
        }
    })
    return txt;
}

export {colorType,formatTime,getValuesByDate,retBoxType,retText,retColor}