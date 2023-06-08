import { USER_API } from "@/config/api"
import { http } from "@/utils/http"

export const userService = {
    register(data){
        return http.post(`${USER_API}/register`, data)
    },
    getProfile() {
        return http.get(`${USER_API}`)
    },
    updateProfile(data) {
        return http.patch(`${USER_API}`, data)
    },
    changePassword(data) {
        return http.post(`${USER_API}/change-password`, data)
    },

    newAddress(data) {
        return http.post(`${USER_API}/address`, data)
    },
    getAddress(query = '') {
        return http.get(`${USER_API}/address${query}`)
    },
    getAddressDetail(id) {
        return http.get(`${USER_API}/address/${id}`)
    },
    editAddress(id, data) {
        return http.patch(`${USER_API}/address/${id}`, data)
    },
    deleteAddress(id) {
        return http.delete(`${USER_API}/address/${id}`)
    }
}