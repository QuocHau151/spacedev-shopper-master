import { FILE_API } from "@/config/api"
import { http } from "@/utils/http"

export const fileService = {
    upload(file) {
        const formData = new FormData()
        formData.append('file', file)
        return http.post(`${FILE_API}`, formData)
    }
}