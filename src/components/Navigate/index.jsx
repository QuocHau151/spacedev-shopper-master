import { useEffect } from "react"
import { useNavigate } from 'react-router-dom'

export const Navigate = ({ to, replace = true, ...props }) => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate(to, { ...props, replace })
    }, [])

    return null
}
