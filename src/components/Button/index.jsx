import { cn } from '@/utils'
import React from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

export const Button = ({ type = 'default', size = 'sm', link, loading, children, ...props }) => {
    const navigate = useNavigate()

    return (
        <button onClick={() => link && navigate(link)} className={cn("btn flex gap-2 items-center", `btn-${size}`, props.className, {
            'disabled pointer-events-none': loading,
            'btn-dark': type === 'default',
            'btn-outline-dark': type === 'outline',
        })} {...props}>
            {loading && <LoadingOutlined />}
            {children}
        </button>
    )
}
