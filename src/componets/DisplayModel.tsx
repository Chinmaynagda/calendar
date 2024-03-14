import { Box, Button, Input, InputLabel, Modal, Typography, capitalize } from "@mui/material";
import React from "react";
import LS_obj, { todoType } from "../types";
import { formatTime } from "../App/utilsFunction";
import { useDispatch } from "react-redux";
import { removeTodo } from "../features/todo/todoSlice";


type modelData = {
    item: todoType|null,
    open: boolean,
    handleClose: () => void,
    onEditTask: (st:string | null) => void
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




const DisplayModel: React.FC<modelData> = (props) => {
    const { item, open , handleClose, onEditTask } = props;
    const dispatch =useDispatch();

    function onDeleteClick(id:string) {
        dispatch(removeTodo(id));
        handleClose();
    }

    if(item===null){
        return (
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Box sx={{padding:'5px', margin:'5px',display:'grid',gridTemplateRows:'1fr', rowGap:'1rem'}}>
                         <Typography textAlign='center' variant="h5">Looks Like You have no task at this time and Date</Typography>
                         <Button variant="contained" className="orgBtn" onClick={() =>onEditTask(null)}>Add Task</Button>
                    </Box>
                </Box>
            </Modal>
        );

    }else{
        return(

        <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography variant='h5' textAlign='center'>Task Details</Typography>
                    <Box sx={{padding:'5px', margin:'5px',display:'grid',gridTemplateRows:'1fr', rowGap:'1rem'}}>
                         <Typography variant='h4' textAlign='center' textTransform='capitalize'>{item.title}</Typography>
                         <Typography variant='subtitle2' textAlign='center' >{`${formatTime(item.startTime)} to ${formatTime(item.endTime)}`}</Typography>
                         <Typography variant="body1" textAlign='left'>Type: {item.type}</Typography>
                         <Typography variant="body2" textAlign='left'>Description: {item.description}</Typography>
                    </Box>
                    <Box sx={{marginTop:"2rem",display:'flex', justifyContent:'space-between'}}>
                        <Button variant="contained" className="orgBtn" onClick={()=>onDeleteClick(item.id)} > Delete </Button>
                        <Button variant="contained" className="orgBtn" onClick={()=>onEditTask(item.id)}> Edit </Button>
                        <Button variant="contained" className="orgBtn" onClick={handleClose}> Close </Button>
                    </Box>
                </Box>
            </Modal>);
        

    }
}

export default DisplayModel;