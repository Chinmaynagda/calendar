import React, { useState } from 'react';
import './App.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { Button, Input, Box, Typography, Modal } from '@mui/material';
import MonthTable from './componets/MonthTable';
import DayList from './componets/DayList';
import WeekTable from './componets/WeekTable';
import TaskModel from './componets/TaskModel';
import LS_obj from './types';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'


function App() {
  

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function DisplayWeek({ week }: { week: Date[] }) {
    return (
      <Table>
        <TableBody>
          {week.map((item, index) => <TableRow key={item.toISOString()}>
            <TableCell>{days[index]}</TableCell>
            <TableCell>{item.toLocaleDateString()}</TableCell>
          </TableRow>)}
        </TableBody>
      </Table>
    )
  }

  let hours: Array<number> = [];
  for (let i = 0; i <= 24; i++) {
    hours.push(i);
  }


  const getMonthSize = (month: number, year: number): number => {
    switch (month) {
      case 0:
      case 2:
      case 4:
      case 6:
      case 7:
      case 9:
      case 11:
        return 31;
      case 1:
        return year % 4 === 0 ? 29 : 28;
      default:
        return 30;
    }
  };

  const getEndDay = (day: number, month: number, year: number): number => {
    return new Date(`${year}-${month + 1}-${day}`).getDay();
  };

  const convertToDateArray = (date: Date): Date[][] => {
    const mm = date.getMonth();
    const yy = date.getFullYear();
    const startDay = new Date(`${yy}-${mm + 1}-01`).getDay();
    const monthSize = getMonthSize(mm, yy);

    let temp: Date[][] = [];
    let week: Date[] = [];
    let day = 1;

    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      const prevMonthSize = getMonthSize(mm === 0 ? 11 : mm - 1, mm === 0 ? yy - 1 : yy);
      week.push(new Date(yy, mm === 0 ? 11 : mm - 1, prevMonthSize - i));
    }

    // Current month days
    for (let i = startDay; i <= 6; i++) {
      week.push(new Date(yy, mm, day++));
    }

    temp.push(week);

    // Remaining weeks of the current month
    while (day <= monthSize) {
      week = [];
      for (let i = 0; i < 7 && day <= monthSize; i++) {
        week.push(new Date(yy, mm, day++));
      }
      temp.push(week);
    }

    // Next month days
    const endDay = getEndDay(monthSize, mm, yy);
    let nextMonthDay = 1;
    if (endDay < 6) {
      week = [];
      for (let i = endDay + 1; i <= 6; i++) {
        temp[temp.length - 1].push(new Date(yy, mm + 1, nextMonthDay++));
      }
    }
    return temp;
  };

  const [dt, setDt] = useState(new Date());
  const thisMonth: Date[][] = convertToDateArray(new Date());
  const [dateArray, setDateArray] = useState(thisMonth);
  const [req_week, setReq_week] = useState(thisMonth[0]);


  const [monthView, setMonthView] = useState('block');
  const [weekView, setWeekView] = useState('none');
  const [dayView, setDayView] = useState('none');


  const setDate = (date:Date) => setDt(date); 

  const prevMonth = () => {
    const mm = dt.getMonth();
    const yy = dt.getFullYear();
    let pdy = new Date(mm == 0 ? yy - 1 : yy, mm == 0 ? 11 : mm - 1, 1, 12);
    setDt(pdy);
    const pMonth = convertToDateArray(pdy);
    setDateArray(pMonth);
  }

  const nextMonth = () => {
    const mm = dt.getMonth();
    const yy = dt.getFullYear();
    let ndy = new Date(mm == 11 ? yy + 1 : yy, mm == 11 ? 0 : mm + 1, 1, 12);
    setDt(ndy);
    const nMonth = convertToDateArray(ndy);
    setDateArray(nMonth);
  }


  const getWeek = () => {
    //  console.log("GetWeek Called",dt);

    dateArray.forEach((item) => {
      //console.log(item,dt,item.includes(dt));
      item.forEach((day) => {
        if (day.getDate() === dt.getDate()) {
          setReq_week([...item])
        }
      })
      //  console.log(req_week.includes(dt));
    }
    )
  }

  const getDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDt(new Date(`${e.target.value}`))
  }

  const openMonthView = () => {
    setWeekView('none');
    setDayView('none');
    setMonthView('block');
    setDateArray(convertToDateArray(dt));
  }
  const openWeekView = () => {
    setMonthView('none');
    setDayView('none');
    setWeekView('block');
    getWeek();
  }

  const openDayView = () => {
    setMonthView('none');
    setWeekView('none');
    setDayView('block');
  }

 

  const monthViewer = () => {
    setDateArray(convertToDateArray(dt));
    openMonthView();
  }

  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
 

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', marginX: '2.5vw', marginY: '2vh', justifyContent: 'space-between' }}>
        <Typography variant='h4'>Calender</Typography>
        <Box sx={{ display: monthView }}>
          <Box sx={{ display: 'flex', columnGap: '2px' }}>
            <Button onClick={prevMonth} sx={{ color: 'orange' }}><NavigateBeforeIcon /></Button>
            <Input type='date' name='date' value={formatDate(dt)} onChange={getDate} />
            <Button onClick={nextMonth} sx={{ color: 'orange' }}><NavigateNextIcon /></Button>
          </Box>
        </Box>
        <Button variant='contained' onClick={monthViewer} className='orgBtn'> Month View</Button>
        <Button variant='contained' onClick={openWeekView} className='orgBtn' sx={{ display: monthView }}>Week View</Button>
        <Button variant='contained' onClick={openDayView} className='orgBtn' sx={{ display: monthView }}>Day View</Button>
        
      </Box>
    

      <Box mx={5} my={2} sx={{ display: monthView }}>
        <TableContainer component={Paper} >
          <MonthTable month={dateArray} date={dt} setDate={setDate} />
        </TableContainer>
      </Box>
      <Box mx={5} sx={{ display: weekView }}>
        <WeekTable week={req_week} date={dt} />
      </Box>
      <Box mx={5} sx={{ display: dayView }}>
        {<DayList day={dt} />}
      </Box>
      </LocalizationProvider>
    </>
  );
}

export default App;
