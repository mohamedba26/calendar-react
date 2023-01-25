import React,{useEffect, useState} from 'react'
import FullCalendar from '@fullcalendar/react' 
import timeGridPlugin from '@fullcalendar/timegrid';
import { DateSelectionApi } from 'fullcalendar';
import EventForm from './EventForm';
import Box from '@mui/material/Box';
import { GetTravails } from '../Services/TravailService';
import ConfirmUpdate from './ConfirmUpdate';

export default function Test() {
    const[events,setEvents]=useState([])
    const[openForm,setOpenForm]=useState(false)
    const[openUpdate,setOpenUpdate]=useState(false)
    const[prop,setProp]=useState({})
    const[id,setId]=useState("")

    const openEventForm=event=>{
        setProp(event)
        setOpenForm(true)
    }

    const handleUpdate=event=>{
        setId(event.event._def.publicId)
        var timeStart=event.event._instance.range.start
        timeStart.setHours(timeStart.getHours()-1)
        var timeEnd=event.event._instance.range.end
        timeEnd.setHours(timeEnd.getHours()-1)
        setEvents(events.map(e=>{
            if(e.id!==event.event._def.publicId)
                return e
            else
            {
                e.start=timeStart
                e.end=timeEnd
                return e
            }
        }))
        setProp({end:event.event._instance.range.start,start:event.event._instance.range.end,id:id})
        setOpenUpdate(true)
    }

    const render=()=>{
        GetTravails().then(res=>{
            res.data.map(event=>{
                delete event.client
                delete event.clientId
                delete event.mission
                delete event.missionId
                return null
            })
            setEvents(res.data)
        })     
    }

    const handleClick=(e)=>{
        setId(e.event._def.publicId)
        setOpenForm(true)
    }

    const checkSelect=(event)=>{
        return event.end.getDate()===event.start.getDate() && event.end.getMonth()===event.start.getMonth() && event.end.getFullYear()===event.start.getFullYear()
    }

    const closeUpdate=()=>setOpenUpdate(false)

    const closeForm=()=>setOpenForm(false)

    useEffect(()=>{
        if(!openUpdate)
        {
            render()
            setId("")
        }
    },[openUpdate,openForm])

  return (
      <Box>
        <FullCalendar 
            plugins={[ timeGridPlugin]} 
            initialView="timeGridWeek"
            selectable
            selectMirror
            editable
            firstDay={1}
            allDaySlot={false} 
            slotDuration={'00:15:00'} 
            headerToolbar= {{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={events}
            selectOverlap={false}
            eventOverlap={false}
            select={openEventForm}
            eventClick={handleClick}
            eventDrop={handleUpdate}
            eventResize={handleUpdate}
            selectAllow={checkSelect}
        />
        <EventForm id={id} prop={prop} op={openForm} close={closeForm} />
        <ConfirmUpdate id={id} prop={prop} op={openUpdate} close={closeUpdate}/>
    </Box>
  )
}