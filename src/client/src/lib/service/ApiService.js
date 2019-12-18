import { toast } from "react-toastify"
import AuthService from "./AuthService"

const ENVIRONMENT = "DEV"
const API_ROOT = ENVIRONMENT === "DEV" ? "http://localhost:4000/" : "/"
const TOAST_OPTIONS = { position: toast.POSITION.BOTTOM_RIGHT }

                // "Content-Type": "multipart/form-data", 
const fetchApi = async (apiMethod, restMethod, params, successMsg) => {
    const token = AuthService.tokenValue
    const tokenheader = token ? { "Authorization": `Bearer ${token}` } : {}
    try {
            if (["POST", "PUT", "PATCH"].includes(restMethod)){    
                const formData  = new FormData();

                for(const name in params) {
                  formData.append(name, params[name]);
                }            
                const response = await fetch(API_ROOT + apiMethod, { method: restMethod, body: formData, headers: tokenheader })
                if (response.ok){
                    toast.success(successMsg, TOAST_OPTIONS)
                    const result = await response.json()
                    if(Object.keys(result).includes("image")) result.image = API_ROOT + "upload/" + result.image
                    return  result
                }
                else return new Error((await response.json()).message)
            }
            if (["GET", "DELETE"].includes(restMethod)){
                const response = await fetch(API_ROOT + apiMethod, { method: restMethod, headers: { "Content-Type": "application/json", ...tokenheader } })
                if (restMethod === "GET"){
                    const result = await response.json()
                    if(Object.keys(result).includes("image")) result.image = API_ROOT + "upload/" + result.image
                    return  result
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
    postType: {
        create: async (params) => await fetchApi("postType", "POST", params, "Post type created successfully!"),
        getCommunityPostTypes: async (id)  => await fetchApi(`postType/community/${id}`, "GET")
    },
    user: {
        create: async (params) => await fetchApi("user", "POST", params, "Account created successfully!"),
        getAll: async () => await fetchApi("user", "GET"),
        get: async (id) => await fetchApi(`user/${id}`, "GET")
    },
    fieldType: {
        getAll: async () => await fetchApi("fieldType", "GET")
    }
}

export { api };