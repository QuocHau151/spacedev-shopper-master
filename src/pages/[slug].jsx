import React from 'react'
import { useParams } from 'react-router-dom'
import Page404 from './404'

export default function ProductDetail() {
    const { slug } = useParams()
    const [,id] = slug.split('-p')
    


    if(!id) return <Page404 />

    return (
        <div>ProductDetail</div>
    )
}
