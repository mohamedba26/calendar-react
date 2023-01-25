import axios from "axios";

export const GetTravailById = async (id) =>{
    let res=await axios.get(`https://localhost:7210/api/Travail/${id}`)
    return res
}

export const AddTravail = async (Event)=>{
    let res=await axios.post("https://localhost:7210/api/Travail",Event)
    return res
}

export const UpdateTravail = async (id,Event) => {
    let res=await axios.put(`https://localhost:7210/api/Travail/${id}`,Event)
    return res
}

export const DeleteTravail = async (id) => {
    let res=await axios.delete(`https://localhost:7210/api/Travail/${id}`)
    return res
}

export const GetTravails = async () => {
    let res=await axios.get(`https://localhost:7210/api/Travail`)
    return res
}