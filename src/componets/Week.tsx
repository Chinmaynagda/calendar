import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { Box, Typography } from '@mui/material';
import { stateType, todoType } from '../types';
import { colorType, formatTime, getValuesByDate } from '../App/utilsFunction';
import { useSelector } from 'react-redux';


interface ListItemsProps {
    arr: Array<todoType>;
    handleOpen : () => void,
    onEditTask: (st:string) => void,
    getModelData: (item:todoType) => void,
    getID: (id:string) => void,
  }

type weekData = {
    week: Array<Date>,
    date: Date,
    handleOpen : () => void,
    handleClose : () => void,
    handleTaskOpen : () => void,
    handleTaskClose : () => void,
    getModelData: (item:todoType|null) =>void,
    onEditTask: (st:string) => void,
    setDate: (date:Date) => void,
    getID: (id:string|null) =>void
}

  
  const ListItems:React.FC<ListItemsProps> = (props) =>{
    const {arr,handleOpen,onEditTask,getModelData,getID} = props;
    function onListClick(item:todoType,e:React.MouseEvent<HTMLDivElement>){
        e.stopPropagation();
        getModelData(item)
        handleOpen();
        getID(item.id);
    }
     return(
        <Box sx={{display:'grid', gridTemplateRows:'1fr'}}>
            {
                arr.map((item:todoType) =>
                   <Box component='div' key={item.id} sx={{
                    backgroundColor: colorType(item.type),
                    border: '1px solid transparent',
                    borderRadius: '10px',
                    padding: 'auto'
                    }}
                    onClick={(e)=>onListClick(item,e)}
                    > 
                       <Typography sx={{textAlign:'center',fontSize:'smaller'}}>{`${item.title} | ${formatTime(item.startTime)} - ${formatTime(item.endTime)}`}</Typography>
                   </Box>
                )
            }
        </Box>
     );
  }





const Week:React.FC<weekData> = (props) =>{
    const {week,date,handleOpen,handleClose,handleTaskOpen,handleTaskClose,getModelData,onEditTask,setDate,getID} = props
    const todos = useSelector((state:stateType) => state.todos)

    const onClickFunc = (date:Date) =>{ 
        getID(null);
        setDate(date);
        handleTaskOpen();
      
    }

    return (
        <TableRow>
    {week.map((day) => (
        <TableCell key={day.toISOString()} className='tableCell' onClick={() => onClickFunc(day)}
            sx={{
                backgroundColor: date.toDateString() === day.toDateString() ? 'rgb(255, 235, 198)' : 'transparent',
                position: 'relative',
            }}
        >
            <Box sx={{ position: 'absolute', top: '0px', left: '0px' }}>{day.getDate()}</Box>

            <Box
                component='div'
                sx={{
                    color: day.getMonth() !== date.getMonth() ? 'grey' : 'black',
                    display: 'grid',
                    gridTemplateRows: '1fr',
                }}
            >
                <ListItems
                    arr={getValuesByDate(day, todos) as Array<todoType>}
                    handleOpen={handleOpen}
                    onEditTask={onEditTask}
                    getModelData={getModelData}
                    getID={getID}
                />
            </Box>
        </TableCell>
    ))}
</TableRow>

    );
}

export default Week;