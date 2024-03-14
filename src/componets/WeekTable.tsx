import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box, Divider, Typography } from '@mui/material';
import { formatTime, retBoxType, retText } from '../App/utilsFunction';
import { stateType, todoType } from '../types';
import { useSelector } from 'react-redux';

type weekDt = {
  week: Array<Date>,
  date: Date,
}

let hours: Array<number> = [];
for (let i = 0; i <= 23; i++) {
  hours.push(i);
}

const WeekColumn: React.FC<{ w_dt: Date }> = ({ w_dt }) => {
  const values: Array<todoType> = useSelector((state: stateType) => state.todos);
  const dayValues = values.filter((todo) => todo.date === w_dt.toLocaleDateString('en-US',{
    year: 'numeric',
    month: 'numeric', 
    day: 'numeric' 
}));
  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      border: "1px solid lightgrey",
    }}>
      {
        hours.map((hour) =>
          <Box sx={{height:'7.5vh',borderBottom:'1px solid lightgrey'}} >
            <Box component='div' sx={() => retBoxType(hour, dayValues)}>
              <Typography textAlign='center'>{retText(hour, dayValues)}</Typography>
            </Box>
          </Box>
        )
      }
    </Box>

  );
}

const WeekTable: React.FC<weekDt> = (props) => {
  const { week, date } = props
  return (
    <Box my={5}>
       <Box sx={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr 2fr 2fr 2fr 2fr 2fr 2fr',
        textAlign:'center'
       }}>
        <Box sx={{backgroundColor:'lightgray',padding:'1rem' ,border:'1px solid white'}}><Typography>Time</Typography></Box>
        {
          week.map((day)=>
          <Box sx={{border:'1px solid white', padding:'1rem', backgroundColor:day.getDate() === date.getDate()?'orange':'lightgrey'}}>
            <Typography>
              {day.toDateString()}
            </Typography>
          </Box>)
        }

       </Box>
       <Box sx={{
      display: 'grid',
      gridTemplateColumns: '1fr 2fr 2fr 2fr 2fr 2fr 2fr 2fr'
    }}>
      <Box>
        {
          hours.map((hour) =>
            <Box
              sx={{
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end',
                border: "1px solid lightgrey",
                height: '7.5vh'
              }}>
              <Typography fontSize='small' py={0}>{formatTime(`${hour}:00`)}</Typography>
            </Box>)
        }

      </Box>
      {
        week.map((tdt) => <WeekColumn w_dt={tdt} />)
      }


    </Box>
    </Box>
    

  );
}

export default WeekTable;


{/* <TableContainer component={Paper}>
<Table>
  <TableHead>
    <TableRow className='rowHead'>
        <TableCell><Typography textAlign='center' variant='h6'> Time </Typography></TableCell>
      {week.map((item,idx) => <TableCell key={idx} >
        <Box textAlign='center' py={1} sx={{border: '1px transparent' , borderRadius:'10px',
        backgroundColor: item.getDate() === date.getDate()?'orange':'transparent'}}>
          <Typography textAlign='center' variant='h6'> {item.toDateString()} </Typography>
        </Box>
        </TableCell>)}
    </TableRow>
  </TableHead>
  <TableBody>
    {
      hours.map((hour,idx)=>
      <>
      <TableRow>
        <TableCell sx={{borderRight:'1px dotted lightgrey '}}><Divider textAlign='left'>{hour}</Divider></TableCell>
        {
            week.map(() => <TableCell sx={{borderRight:'1px dotted lightgrey '}}>
                <Box component='div' sx={{height:'5vh'}}></Box>
                </TableCell>)
        }
      </TableRow>
     
      </>
      ) 
    }        
  </TableBody>
</Table>
</TableContainer> */}

