import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Week from './Week';
import { Box } from '@mui/material';
import { useState } from 'react';
import LS_obj, { todoType } from '../types';
import DisplayModel from './DisplayModel';
import TaskModel from './TaskModel';

type monthData = {
    month: Array<Array<Date>>,
    date: Date,
    setDate: (date:Date)=>void;
}

const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MonthTable:React.FC<monthData> = (props) => {

  const [open, setOpen] = useState(false);
    const [modelData, setModelData] = useState<todoType | null>(null)
    const handleOpen = () => setOpen(true);

    const handleClose = () => {
      setOpen(false);
    }
   

    const [taskModelOpen, setTaskModelOpen] = useState(false);
    const handleTaskOpen = () =>{
      setTaskModelOpen(true);
    } 
    const handleTaskClose = () => setTaskModelOpen(false);
    const [editID,setEditID] = useState<string|null>(null);
 
    function onEditTask(st: string|null) {
      handleClose();
      handleTaskOpen();
  }

  const obj: LS_obj = {
    startTime: '00:00',
    endTime: '00:00',
    title: '',
    type: '',
    description: ''
}

function getModelData(item:todoType|null){
  setModelData(item);
}

const getID = (st:string|null) => setEditID(st);


    const {month,date,setDate} = props;
    return(
      <Box component='div' >
        <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className='rowHead'>
              {days.map((item,idx) => <TableCell key={idx} className='headCell'>
                <Box textAlign='center' py={1} sx={{border: '1px transparent' , borderRadius:'10px',
                backgroundColor: idx === date.getDay()?'orange':'transparent'}}>
                  {item}
                </Box>
                </TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>
            {
                month.map((week,idx)=><Week 
                key={idx} 
                week={week} 
                date={date} 
                handleOpen={handleOpen} 
                handleClose={handleClose}
                handleTaskClose={handleTaskClose}
                handleTaskOpen={handleTaskOpen}
                getModelData = {getModelData}
                onEditTask={onEditTask}
                setDate={setDate}
                getID={getID}
                />)
            }        
          </TableBody>
        </Table>
      </TableContainer>
      <DisplayModel item={modelData} open={open} handleClose={handleClose}  onEditTask={onEditTask} />      
      <TaskModel date={date} open={taskModelOpen} forEdit={editID} handleTaskOpen={handleTaskOpen} handleTaskClose={handleTaskClose} initialTask={modelData ? modelData : obj} />  
      </Box>
    );
}

export default MonthTable;