import React, { useRef } from 'react'
import { Link, Navigate, generatePath, useLocation, useNavigate } from 'react-router-dom'
import Skeleton from '../Skeleton'
import { currency } from '@/utils/currency'
import { useCategory } from '@/hooks/useCategories'
import { slugify } from '@/utils/slugify'
import { PATH } from '@/config/path'
import { useQuery } from '@/hooks/useQuery'
import { productService } from '@/services/product'
import { Popconfirm, message } from 'antd'
import { MESSAGE } from '@/config/message'
import { handleError } from '@/utils/handleError'
import { delay } from '@/utils'
import { Button } from '../Button'
import { useAuth } from '@/hooks/useAuth'

export const ProductCard = ({ onRemoveWishlistSuccess, showRemove, showWishlist, categories, name, price, real_price, images, slug, id, rating_average, review_count }) => {
    const { user } = useAuth()
    const loadingWishlsitRef = useRef(false)
    const loadingRemoveWishlistRef = useRef(false)
    const category = useCategory(categories)
    const navigate = useNavigate()
    const image1 = images[0].thumbnail_url
    const image2 = images?.[1]?.thumbnail_url || image1
    const salePrice = price - real_price

    const _slug = '/' + slug

    const onAddWishlist = async () => {
        if(loadingWishlsitRef.current) return
        loadingWishlsitRef.current = true

        const key = `wishlist-${id}`
        try {
            message.loading({
                key,
                content: MESSAGE.LOADING_ADD_WISHLIST(name),
                duration: 0
            })
            // await delay(100000)
            await productService.addWishlist(id)
            message.success({
                key,
                content: MESSAGE.ADD_WISHLIST_SUCCESS(name)
            })

        } catch (err) {
            handleError(err, key)
        }
        loadingWishlsitRef.current = false
    }

    const _onRemoveWishlist = async () => {
        if(loadingRemoveWishlistRef.current) return

        loadingRemoveWishlistRef.current = true
        const key = `remove-wishlist-${id}`
        try {
            message.loading({
                key,
                content: MESSAGE.LOADING_REMOVE_WISHLIST(name),
                duration: 0
            })
            await productService.removeWishlist(id)
            onRemoveWishlistSuccess?.(id)
            message.success({
                key,
                content: MESSAGE.REMOVE_WISHLIST_SUCCESS(name)
            })
        } catch (err) {
            handleError(err, key)
        }
        loadingRemoveWishlistRef.current = false
    }

    return (
        <div className="product-card card mb-7">
            {/* Badge */}
            {
                salePrice > 0 && <div className="card-sale badge badge-dark card-badge card-badge-left text-uppercase">
                    -{Math.floor(salePrice / price * 100)}%
                </div>
            }

            {/* Image */}
            <div className="card-img">
                {/* Image */}
                <Link to={_slug} className="card-img-hover" href="product.html">
                    <img className="card-img-top card-img-back" src={image2} alt="..." />
                    <img className="card-img-top card-img-front" src={image1} alt="..." />
                </Link>
                {/* Actions */}
                <div className="card-actions">
                    <span className="card-action">
                    </span>
                    <span className="card-action">
                        <button className="btn btn-xs btn-circle btn-white-primary" data-toggle="button">
                            <i className="fe fe-shopping-cart" />
                        </button>
                    </span>
                    {
                        showWishlist && (
                            <Popconfirm disabled={user} title={<span className='text-lg'>Thông báo</span>} description={
                                <>
                                    <p className='text-lg'>Bạn cần đăng nhập trước khi sử dụng chức năng này</p>
                                    <div className='flex justify-end gap-2'>
                                        {/* <Button type='outline'>Hủy bỏ</Button> */}
                                        <Button onClick={() => navigate(PATH.account, { state: { redirect: window.location.pathname + window.location.search } })} >Đăng nhập</Button>
                                    </div>
                                </>
                            }
                                showCancel={false}
                                okButtonProps={{ hidden: true }}
                            >
                                <span className="card-action">
                                    <button onClick={() => user && onAddWishlist()} className="btn btn-xs btn-circle btn-white-primary" data-toggle="button">
                                        <i className="fe fe-heart" />
                                    </button>
                                </span>
                            </Popconfirm>
                        )
                    }

                    {
                        showRemove && (
                            <span className="card-action">
                                <button onClick={_onRemoveWishlist} className="btn btn-xs btn-circle btn-white-primary" data-toggle="button">
                                    <i className="fe fe-x" />
                                </button>
                            </span>
                        )
                    }

                </div>
            </div>
            {/* Body */}
            <div className="card-body px-0">
                {/* Category */}
                <div className="card-product-category font-size-xs">
                    {
                        category && category.title && <Link className="text-muted" to={generatePath(PATH.category, { slug: slugify(category.title), id: category.id })}>{category.title}</Link>
                    }
                </div>
                {/* Title */}
                <div className="card-product-title font-weight-bold">
                    <Link className="text-body card-product-name" to={_slug}>
                        {name}
                    </Link>
                </div>
                <div className="card-product-rating">

                    {rating_average > 0 && <>
                        {rating_average}
                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                        ({review_count} nhận xét)
                    </>}

                </div>
                {/* Price */}
                <div className="card-product-price flex items-baseline ">
                    {
                        real_price < price ? <>
                            <span className="text-primary sale">{currency(real_price)}</span>
                            <span className="font-size-xs text-gray-350 text-decoration-line-through ml-1">{currency(price)}</span>
                        </> : <>
                            <span className="text-xl flex h-full items-end">{currency(real_price)}</span>
                        </>
                    }

                </div>
            </div>
        </div>
    )
}

export const ProductCardLoading = () => {

    return <div className="product-card card mb-7">
        {/* Image */}
        <div className="card-img">
            {/* Image */}
            <Link to='#' className="card-img-hover" href="product.html">
                <Skeleton height={300} />
            </Link>
        </div>
        {/* Body */}
        <div className="card-body px-0">
            {/* Category */}
            <div className="card-product-category font-size-xs">
                <a className="text-muted" href="shop.html">
                    <Skeleton height='100%' width={150} />
                </a>
            </div>
            {/* Title */}
            <div className="card-product-title font-weight-bold">
                <Link className="text-body card-product-name" to='#'>
                    <Skeleton height='100%' />
                </Link>
            </div>
            <div className="card-product-rating">
                <Skeleton height='100%' width={150} />
            </div>
            {/* Price */}
            <div className="card-product-price">
                <Skeleton height='100%' width={100} />
            </div>
        </div>
    </div>
}