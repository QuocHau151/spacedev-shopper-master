import { PRODUCT_API } from "@/config/api"
import { http } from "@/utils/http"

export const productService = {
    getProduct(query = '', signal) {
        return http.get(`${PRODUCT_API}${query}`, { signal })
    },
    getCategories() {
        return http.get(`${PRODUCT_API}/categories`)
    },
    getCategoryDetail(id) {
        return http.get(`${PRODUCT_API}/categories/${id}`)
    },


    getWishlist(query = '') {
        return http.get(`${PRODUCT_API}/wishlist/${query}`)
    },
    addWishlist(productId) {
        return http.post(`${PRODUCT_API}/wishlist/${productId}`)
    },
    removeWishlist(productId) {
        return http.delete(`${PRODUCT_API}/wishlist/${productId}`)
    }
}