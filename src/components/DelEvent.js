import { Box, Modal ,Button} from '@mui/material'
import React, { useState } from 'react'
import { DeleteTravail } from '../Services/TravailService';
import Stack from '@mui/material/Stack';

export default function DelEvent({id,close}) {

    const[open,setOpen]=useState(false)

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 200,
        height: 110,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        pt: 2,
        px: 4,
        pb: 3,
      };
      const handleDelete=()=>{
        DeleteTravail(id).then(res=>
            {res.data?close():alert("failed delete")
            setOpen(false)
        })
      }
  return (
    <Box>
        <Button variant="contained" onClick={()=>setOpen(true)} color="error">delete</Button>
        <Modal
            open={open}
            onClose={()=>setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box sx={{marginBottom:"10px"}}>are you sur you want to delete this event</Box>
                <Box sx={{marginTop:"30px"}}>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" onClick={()=>setOpen(false)}>fermer</Button>
                    <Button variant="contained" onClick={handleDelete} color="error">delete</Button>
                </Stack>
                </Box>
            </Box>
        </Modal>
    </Box>
  )
}
