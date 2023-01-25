import axios from "axios"

export const GetMissionByClientId = async (id) =>{
    let res=await axios.get(`https://localhost:7210/api/ClientMissions/${id}`)
    return res
}