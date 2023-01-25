import { Box,Button } from '@mui/material'
import React, { useEffect,useState } from 'react'
import { UpdateTravail } from '../Services/TravailService'
import { Modal } from '@mui/material';
import { Stack } from '@mui/system';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ConfirmUpdate({prop,id,op,close}) {

  const[open,setOpen]=useState(false)

  const handleUpdate=()=>{
    UpdateTravail(id,prop).then((res)=>res.status===200?handleClose():alert("failed update"))
  }

  const handleClose=()=>{
    setOpen(false)
    close()
  }

  useEffect(()=>{
    setOpen(op)
  },[op])

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box>are you sur you want to update this event</Box>
        <Box sx={{marginTop:"30px"}}>
          <Stack direction="row" spacing={2} sx={{float:"right"}}>
            <Button variant="contained" onClick={handleClose}>close</Button>
            <Button variant="contained" onClick={handleUpdate}>update</Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  )
}
