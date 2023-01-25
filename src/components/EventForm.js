import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextareaAutosize, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { TwitterPicker } from 'react-color';
import { format } from 'date-fns';
import { AddTravail, GetTravailById, UpdateTravail } from '../Services/TravailService';
import Stack from '@mui/material/Stack';
import DelEvent from './DelEvent';
import { Modal } from '@mui/material';
import { GetClients } from '../Services/ClientService';
import { GetMissionByClientId } from '../Services/ClientMissionService';

export default function EventForm({prop,id,op,close}) {
  const[displayColorPicker,setDisplayColorPicker]=useState(false)
  const[color,setColor]=useState({})
  const[event,setEvent]=useState({})
  const[open,setOpen]=useState(false)
  const[stateId,setStateId]=useState("")
  const[clients,setClients]=useState([])
  const[missions,setMissions]=useState([])
  const[timeStyle,setTimeStyle]=useState({color:"red",display:"none",marginBottom:"15px"})
  const[inputStyle,setInputStyle]=useState({color:"red",display:"none",marginBottom:"15px"})

  const styles = {
      color: {
        width: '36px',
        height: '14px',
        borderRadius: '2px',
        background: `rgba(${ color.r }, ${ color.g }, ${ color.b }, ${ color.a })`,
      },
      swatch: {
        padding: '5px',
        background: '#fff',
        borderRadius: '1px',
        boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
        display: 'inline-block',
        cursor: 'pointer',
      },
      popover: {
        position: 'absolute',
        zIndex: '2',
      },
      cover: {
        position: 'fixed',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
      modal : {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }
  }

  useEffect(()=>{
    setOpen(op)
    setStateId(id)
    if(id!="")
    {
      GetTravailById(id).then(res=>{
        GetClients().then(res=>setClients(res.data))
        var date=Date.parse(res.data.start)
        date=new Date(date)
        res.data.start=date
        var date=Date.parse(res.data.end)
        date=new Date(date)
        res.data.end=date
        GetMissionByClientId(res.data.clientId).then(result=>{
          setEvent(res.data)  
          setMissions(result.data)
        })
        setColor({r:parseInt(res.data.color.substr(1,2),16),g:parseInt(res.data.color.substr(3,2),16),b:parseInt(res.data.color.substr(5,2),16),a:1})
      })
    }
    else
    {
      setEvent({start:prop.start,end:prop.end,color:"#2F6E9A",id:"",clientId:"",missionId:""})
      setColor({r:"47",g:"110",b:"154",a:"1"})
      GetClients().then(res=>setClients(res.data))
    }
  },[op])

  const handleDate=(e)=>{
      var a=event.start
      a.setDate(e.target.value.substr(8))
      a.setMonth(Number(e.target.value.substr(5,2))-1)
      a.setFullYear(e.target.value.substr(0,4))
      setEvent({...event,start:a})
      a=event.end
      a.setDate(e.target.value.substr(8))
      a.setMonth(Number(e.target.value.substr(5,2))-1)
      a.setFullYear(e.target.value.substr(0,4))
      setEvent({...event,end:a})
  }
  const handleTime=(e)=>{
      var a=event[e.target.name]
      a.setHours(e.target.value.substr(0,2))
      a.setMinutes(e.target.value.substr(3,2))
      setEvent({...event,[e.target.name]:a})
  }
  const handleChange=e=>{
    setEvent({...event,[e.target.name]:e.target.value})
  }
  
  const handleChangeClient=e=>{
    setEvent({...event,[e.target.name]:e.target.value})
    GetMissionByClientId(e.target.value).then(res=>setMissions(res.data))
  }
  
  const saveEvent=()=>{
    if(event.start>event.end)
      setTimeStyle({...timeStyle,display:"block"})
    else
      if(Object.keys(event).length!=9)
        setInputStyle({...timeStyle,display:"block"})
      else
      if(stateId=="")
          AddTravail(event).then((res)=>res.status==200?close():alert("failed add"))
        else
          UpdateTravail(stateId,event).then((res)=>res.status==200?close():alert("failed update"))
  }

  const changeColor=(e)=>{
    setColor(e.rgb)
    setEvent({...event,color:e.hex})
  }

  const handleClose=()=>{
    setOpen(false)
    setInputStyle({...timeStyle,display:"none"})
    setTimeStyle({...timeStyle,display:"none"})
    setStateId("")
    close()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={styles.modal}>
        <Box sx={timeStyle}>end time must be after start time</Box>
        <Box sx={inputStyle}>all inputs must be filled</Box>
        <Grid container spacing={2}>
          <Grid item>
            <TextField
              label="Date"
              type="date"
              value={format(event.start||new Date(),"yyyy-MM-dd")}
              sx={{ width: 222 }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handleDate}
            />
          </Grid>
          <Grid item>
            <TextField
              label="Start Time"
              type="time"
              name="start"
              value={format((event.start||new Date()),"HH:mm")}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 1500
              }}
              sx={{ width: 150 }}
              onChange={handleTime}
            />
          </Grid>
          <Grid item>
            <TextField
              label="End Time"
              type="time"
              name="end"
              value={format((event.end||new Date()),"HH:mm")}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 1500
              }}
              sx={{ width: 150 }}
              onChange={handleTime}
            />
          </Grid>
        </Grid>

        <TextField label="title" sx={{width:554}} onChange={handleChange} value={event.title||""} name="title" variant="outlined" margin='dense'/>
        <TextField label="type" name="type" onChange={handleChange} value={event.type||""} sx={{width:554}} variant="outlined" margin='dense'/>
        <FormControl sx={{width:554}} margin='dense'>
          <InputLabel id="client-label">Clients</InputLabel>
          <Select onChange={handleChangeClient} name="clientId" value={event.clientId} label="Clients" labelId="client-label">
            {clients.map((client,i)=><MenuItem value={client.id} key={i}>{client.libelle}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControl sx={{width:554}} margin='dense'>
          <InputLabel id="mission-label">Misssions</InputLabel>
          <Select onChange={handleChange} name="missionId" value={event.missionId} label="Missions" labelId="mission-label">
            {missions.map((mission,i)=><MenuItem value={mission.mission.id} key={i}>{mission.mission.libelle}</MenuItem>)}
          </Select>
        </FormControl>
        <TextareaAutosize value={event.description||""} style={{width:550,height:100}} placeholder="Description" name="description" onChange={handleChange} />
        <Box sx={{marginTop:"10px"}}>
          <Box sx={ styles.swatch } onClick={()=>setDisplayColorPicker(!displayColorPicker) }>
            <Box sx={ styles.color } />
          </Box>
            {displayColorPicker ? <Box sx={ styles.popover }>
              <Box sx={ styles.cover } onClick={()=>setDisplayColorPicker(false)} />
              <TwitterPicker
                colors={["#16A085","#2ECC71","#2F6E9A","#3498DB","#78E8C8","#E01AB5","#8E44AD","#34495E","#D35400","#FC0000"]}
                color={color} 
                onChange={changeColor} />
            </Box> : null }
            <Stack direction="row" spacing={2} sx={{float:"right"}}>
              <Button variant="contained" onClick={handleClose}>close</Button>
              {stateId!=""?<DelEvent id={stateId} close={close} />:null}
              <Button variant="contained" onClick={saveEvent}>{stateId==""?"Add":"Update"}</Button>
            </Stack>
        </Box>
      </Box>
    </Modal>
  )
}