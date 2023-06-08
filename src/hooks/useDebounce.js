import { useRef, useState } from "react"

export const useDebounce = (defaultValue, timout = 300) => {
    const timoutIdRef = useRef()

    const [value, _setValue] = useState(defaultValue)

    const setValue = (value) => {
        if (timoutIdRef.current) {
            clearTimeout(timoutIdRef.current)
        }
        timoutIdRef.current = setTimeout(() => {
            _setValue(value)
            timoutIdRef.current = undefined
        }, timout)
    }

    return [value, setValue]
}