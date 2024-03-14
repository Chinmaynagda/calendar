import { Box, Button, Divider, Typography } from '@mui/material';
import React, { useState } from 'react';
import LS_obj, { stateType, todoType } from '../types';
import DisplayModel from './DisplayModel';
import TaskModel from './TaskModel';
import { colorType,formatTime,getValuesByDate } from '../App/utilsFunction';
import { useSelector } from 'react-redux';


interface DayListProps {
    day: Date;
}

type hourBoxStyle = {
    marginTop: string,
    height: string,
    backgroundColor: string,
}

const obj: LS_obj = {
    startTime: '00:00',
    endTime: '00:00',
    title: '',
    type: '',
    description: ''
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let hours: Array<number> = [];
for (let i = 0; i <= 23; i++) {
    hours.push(i);
}

const DayList: React.FC<DayListProps> = (props) => {

    const { day } = props;
    const todos = useSelector((state:stateType)=>state.todos)
    const values:Array<todoType> = getValuesByDate(day,todos);

    const [open, setOpen] = useState(false);
    const [modelData, setModelData] = useState<todoType | null>(null)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [taskModelOpen, setTaskModelOpen] = useState(false);
    const handleTaskOpen = () => setTaskModelOpen(true);
    const handleTaskClose = () => setTaskModelOpen(false);

    const [editID,setEditID] = useState<string|null>(null);

    function retColor(hr: number) {
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
    

    function retBoxType(hr: number){
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

  

    function retText(hr: number) {
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

    function onClickData(hr: number) {
        handleTaskClose();
        handleOpen();

        let foundMatch = false;
        console.log('hello')
        values.forEach((item) => {
            const st = parseInt(item.startTime.split(':')[0]);
            const et = parseInt(item.endTime.split(':')[0]);
            const em = parseInt(item.endTime.split(':')[1]);
            

            if ((st <= hr && hr < et) ||(st <= hr && hr === et && em!==0) )  {
                setModelData(item);
                foundMatch = true;
                return;
            }
        });

        if (!foundMatch) {
            setModelData(null);
        }
    }

    function onEditTask(st: string|null) {
        handleClose();
        handleTaskOpen();
        setEditID(st);
    }

    return (
        <>
            <Typography textAlign='center' variant='h4'>{day.toLocaleString('en-US', { month: 'short' })} {day.getFullYear()} </Typography>
            <Typography> {day.getDate()} {days[day.getDay()]} </Typography>

            <Box sx={{margin:'3rem',border:'1px solid darkgrey'}}>
                {
                    hours.map((hour) =>
                        <Box component='div' sx={{ display: 'grid', gridTemplateColumns: '1fr 9fr', borderBottom: '1px solid lightgrey', height: '10vh' }}
                          onClick={()=>onClickData(hour)}
                        >
                            <Box
                                sx={{
                                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end',
                                    borderRight: "1px solid lightgrey",
                                    paddingRight: '1rem'
                                }}>
                                <Typography fontSize='small' py={0}>{formatTime(`${hour}:00`)}</Typography>
                            </Box>
                            <Box >
                            <Box component='div' sx={()=>retBoxType(hour)}>
                                <Typography textAlign='center'>{retText(hour)}</Typography>
                            </Box>
                            </Box>
                        </Box>

                    )
                }

            </Box>


            <DisplayModel item={modelData} open={open} handleClose={handleClose}  onEditTask={onEditTask} />
            <TaskModel date={day} open={taskModelOpen} forEdit={editID} handleTaskOpen={handleTaskOpen} handleTaskClose={handleTaskClose} initialTask={modelData ? modelData : obj} />
        </>
    );
}

export default DayList;