import { Box, Button, Input, InputLabel, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import LS_obj, { dateOptions, stateType } from "../types";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, editTodo} from "../features/todo/todoSlice";
import { getValuesByDate } from "../App/utilsFunction";
import { TimePicker } from "@mui/x-date-pickers";
import dayjs from 'dayjs';



type modelData = {
    date: Date,
    initialTask: LS_obj,
    open: boolean,
    forEdit: string|null,
    handleTaskOpen: () => void,
    handleTaskClose: () => void,
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};



const TaskModel: React.FC<modelData> = (props) => {

const { date, initialTask ,open,forEdit, handleTaskOpen, handleTaskClose } = props;
const [startTime, setStartTime] = useState<string>(initialTask.startTime);
const [endTime, setEndTime] = useState<string>(initialTask.endTime);
const [taskTitle,setTaskTitle] = useState<string>(initialTask.title);
const [taskType,setTaskType] = useState<string>(initialTask.type);
const [taskDesc,setTaskDesc] = useState<string>(initialTask.description);


const [canSubmit1,setCanSubmit1] = useState(false);
const [errorMsg1, setErrorMsg1] = useState('');
const [canSubmit2,setCanSubmit2] = useState(false);
const [errorMsg2, setErrorMsg2] = useState('');

const dispatch = useDispatch();
useEffect(()=>{
   setStartTime(initialTask.startTime);
   setEndTime(initialTask.endTime);
   setTaskTitle(initialTask.title);
   setTaskType(initialTask.type);
   setTaskDesc(initialTask.description);
},[initialTask])

    const obj = {
        startTime: startTime,
        endTime: endTime,
        title: taskTitle,
        type: taskType,
        description: taskDesc
    }

     

    const addToHandler = () =>{
        
        // let flag = true;

        // if(startTime>endTime){
        //     flag=false;
        //     setErrorMsg('StartTime should be less then EndTime');
        // }
        
        // values.forEach((item)=>{
        //     if((startTime>item.startTime && startTime<item.endTime) || (startTime>item.startTime && startTime<item.endTime) ){
        //         flag=false;
        //         setErrorMsg('Time Slot Error');
        //     }
        //     if((startTime<item.startTime && endTime>item.endTime)){
        //          flag = false;
        //         setErrorMsg('Time Slot Error');
        //     }
        // });

        // if(taskTitle.length===0){
        //     flag = false;
        //     setErrorMsg('Title is required');
        // }
         

        // if(flag){
        //     setErrorMsg('');

            const todoToAdd = {
                date: date.toLocaleDateString('en-US',{
                    year: 'numeric',
                    month: 'numeric', 
                    day: 'numeric' 
            }
            ),
                startTime: startTime,
                endTime: endTime,
                title: taskTitle,
                type: taskType,
                description: taskDesc
            }
            forEdit?dispatch(editTodo({id:forEdit,...todoToAdd})):dispatch(addTodo(todoToAdd));
            onCloseBtn();
        //}
       
    }
   
    const todos = useSelector((state:stateType)=>state.todos)
    const values = getValuesByDate(date,todos);
    
    const getInitialTime = (tdate:Date,time:string):Date=>{
        const dd = tdate.getDate();
        const mm = tdate.getMonth();
        const yyyy = tdate.getFullYear();
        let [hh,tt] = time.split(':').map((it)=>parseInt(it));
        const dt = new Date(yyyy,mm,dd,hh,tt);
        return dt;
    }

    const checkTime = (time:string,isStart:boolean)=>{
        
        let starttime = startTime;
        let endtime = endTime;
        isStart? starttime = time : endtime = time;
        let flag = true;
        if(starttime > endtime){
            setErrorMsg1('Start Time should be less then end time');
            setCanSubmit1(false);
            flag = false;
          }
        values.forEach((item)=>{
            if((starttime>item.startTime && starttime<item.endTime) || (endtime>item.startTime && endtime<item.endTime)){
              setErrorMsg1('Time Slot occupied');
              setCanSubmit1(false);
              flag = false;
            } 
            
            if(starttime<item.startTime && endtime>item.endTime ){
              setErrorMsg1('Time slot Error');
              setCanSubmit1(false);
              flag = false;
            }
        } )

        if(flag){
            setErrorMsg1('');
            setCanSubmit1(true);
        }
    }

    const checkStartTime =(e:any)=>{
        const time = `${e.$H.toString().padStart(2,'0')}:${e.$m.toString().padStart(2,'0')}` ;
        setStartTime(time);
        checkTime(time,true);
    }
    
    const checkEndTime =(e:any)=>{
        const time = `${e.$H.toString().padStart(2,'0')}:${e.$m.toString().padStart(2,'0')}` ;
        setEndTime(time);
        checkTime(time,false);
    }

    const checkTitle =(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        if(e.target.value.length===0){
            setErrorMsg2('Title is required');
            setCanSubmit2(false);
        }else{
            setErrorMsg2('');
            setCanSubmit2(true);
        }
        setTaskTitle(e.target.value);
    }



    function onCloseBtn() {
        handleTaskClose();
        setEndTime('00:00');
        setStartTime('00:00');
        setTaskTitle('');
        setTaskDesc('');
        setTaskType('');
        setCanSubmit1(false);
        setCanSubmit2(false)
        setErrorMsg1('');
        setErrorMsg2('');

    } 
    return (
        <Modal
            open={open}
            onClose={handleTaskClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography variant='h5' textAlign='center'>Task Details</Typography>
                <Box sx={{ padding: '5px', margin: '5px', display: 'grid', gridTemplateRows: '1fr', rowGap: '1rem' }}>
                    <Box>
                    
                        <TimePicker
                            label="Start-time"
                            value={dayjs(getInitialTime(date,startTime))}
                            onChange={(time) => checkStartTime(time)}
                        />
                    </Box>
                    <Box>
                        
                        <TimePicker
                            label="End-time"
                            value={dayjs(getInitialTime(date,endTime))}
                            onChange={(time) => checkEndTime(time)}
                        />
                    </Box>
                    <Box>
                        <InputLabel htmlFor="title">Title</InputLabel>
                        <Input id="title" required type='text' value={taskTitle} onChange={(e) => checkTitle(e)} />
                    </Box>
                    <Box>
                        <InputLabel htmlFor="type">Type</InputLabel>
                        <Input id="type" type='text' value={taskType} onChange={(e) => setTaskType(e.target.value)} />
                    </Box>
                    <Box>
                        <InputLabel htmlFor="desc">Description</InputLabel>
                        <Input id="desc" type='text' value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" disabled={!canSubmit1 || !canSubmit2} className="orgBtn" onClick={addToHandler}>Submit</Button>
                        <Button variant="contained" className="orgBtn" onClick={onCloseBtn}>Close</Button>
                    </Box>
                    <Typography sx={{ color: 'red' }}>{errorMsg1}</Typography>
                    <Typography sx={{ color: 'red' }}>{errorMsg2}</Typography>
                </Box>
            </Box>
        </Modal>
    );
}

export default TaskModel;