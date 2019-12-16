import { toast } from "react-toastify"
import AuthService from "./AuthService"

const apiRoot = "http://localhost:4000/"
const toastOptions = { position: toast.POSITION.BOTTOM_RIGHT }
// const formData  = new FormData();

// for(const name in params) {
//   formData.append(name, params[name]);
// }
                // "Content-Type": "multipart/form-data", 
const fetchApi = async (apiMethod, restMethod, params, successMsg) => {
    const token = AuthService.tokenValue
    const tokenheader = token ? { "Authorization": `Bearer ${token}` } : {}
    try {
            if (restMethod === "POST"){                
                const response = await fetch(apiRoot + apiMethod, { method: restMethod, body: JSON.stringify(params), headers: { ...tokenheader, "Content-Type": "application/json", } })
                if (response.ok){
                    toast.success(successMsg, toastOptions)
                    return await response.json()
                }
                else return new Error((await response.json()).message)
            }
            if (["GET", "DELETE"].includes(restMethod)){
                const response = await fetch(apiRoot + apiMethod, { method: restMethod, headers: { "Content-Type": "application/json", ...tokenheader } })
                if (restMethod === "GET"){
                    return await response.json()
                }
            }
        } catch (error) {
            toast.error(`Error: ${error}`)
            console.error("Error:", error);
        }
}

const api = {
    community: {
        create: async (params) => await fetchApi("community", "POST", params, "Community created successfully!"),
        getAll: async () => await fetchApi("community", "GET"),
        get: async (id) => await fetchApi(`community/${id}`, "GET"),
        join: async (id) => await fetchApi(`community/${id}/join`, "GET"),
        leave: async (id) => await fetchApi(`community/${id}/leave`, "DELETE"),
    },
    user: {
        create: async (params) => await fetchApi("user", "POST", params, "Account created successfully!"),
        getAll: async () => await fetchApi("user", "GET"),
        get: async (id) => await fetchApi(`user/${id}`, "GET")
    }
}

export { api };