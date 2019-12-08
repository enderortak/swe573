import { toast } from "react-toastify"

const apiRoot = "http://localhost:4000/"
const toastOptions = { position: toast.POSITION.BOTTOM_RIGHT }
const fetchApi = async (apiMethod, restMethod, params, successMsg) => {
    try {
            if (restMethod === "POST"){
                const response = await fetch(apiRoot + apiMethod, { method: restMethod, body: JSON.stringify(params), headers: { "Content-Type": "application/json" } })
                toast.success(successMsg, toastOptions)
                return await response.json()
            }
            if (restMethod === "GET"){
                const response = await fetch(apiRoot + apiMethod, { method: restMethod, headers: { "Content-Type": "application/json" } })
                return await response.json()
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
        get: async (id) => await fetchApi(`community/${id}`, "GET")
    }
}

export { api };