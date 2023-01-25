import axios from "axios"

export const GetClients = async () => {
    let res=await axios.get(`https://localhost:7210/api/Client`)
    return res
}