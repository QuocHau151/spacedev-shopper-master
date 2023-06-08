import { useCategories, useCategory } from '@/hooks/useCategories'
import { useDebounce } from '@/hooks/useDebounce'
import { useQuery } from '@/hooks/useQuery'
import { productService } from '@/services/product'
import { array } from '@/utils/array'
import { currency } from '@/utils/currency'
import { Drawer } from 'antd'
import queryString from 'query-string'
import React, { useState } from 'react'
import Skeleton from '../Skeleton'
import { generatePath } from 'react-router'
import { PATH } from '@/config/path'
import { slugify } from '@/utils/slugify'
import { Link } from 'react-router-dom'

export const SearchDrawer = ({ open, onClose }) => {
    const { data: categories } = useCategories()
    const [value, setValue] = useDebounce('')
    const [categoryId, setCategory] = useDebounce(0)
    const category = useCategory(categoryId)
    const query = queryString.stringify({
        limit: 5,
        name: value || undefined,
        categories: categoryId || undefined
    })
    const { data: { data: products = [] } = {}, loading } = useQuery({
        queryKey: ['search', query],
        queryFn: () => productService.getProduct(`?${query}`),
        enabled: !!value,
    })

    const queryLink = queryString.stringify({
        search: value || undefined
    })

    const viewAllLink = (category ? generatePath(PATH.category, { slug: slugify(category.title), id: category.id }) : PATH.product) + `?${queryLink}`
    return (
        <Drawer open={open} onClose={onClose} bodyStyle={{ padding: 0 }} width={470} headerStyle={{ display: 'none' }}>
            {/* Close */}
            <button onClick={onClose} type="button" className="close !outline-none" data-dismiss="modal" aria-label="Close">
                <i className="fe fe-x" aria-hidden="true" />
            </button>
            {/* Header*/}
            <div className="modal-header line-height-fixed font-size-lg">
                <strong className="mx-auto">Search Products</strong>
            </div>
            {/* Body: Form */}
            <div className="modal-body">
                <div className="form-group">
                    <label className="sr-only" htmlFor="modalSearchCategories">Categories:</label>
                    <select className="custom-select" id="modalSearchCategories" onChange={(ev) => setCategory(parseInt(ev.target.value))}>
                        <option value={0}>Tất cả sản phẩm</option>
                        {
                            categories.map(e => <option key={e.id} value={e.id}>{e.title}</option>)
                        }
                    </select>
                </div>
                <div className="input-group input-group-merge">
                    <input defaultValue={value} onChange={(ev) => setValue(ev.target.value.trim())} className="form-control" type="search" placeholder="Search" />
                    <div className="input-group-append">
                        <button className="btn btn-outline-border" type="submit">
                            <i className="fe fe-search" />
                        </button>
                    </div>
                </div>
            </div>
            {/* Body: Results (add `.d-none` to disable it) */}
            <div className="modal-body border-top font-size-sm">
                {/* Heading */}
                {value ? <p>Kết quả tìm kiếm:</p> : <p className='border p-4'>Tìm kiếm bất kỳ sản phẩm nào mà bạn yêu thích, chúng tôi sẽ gợi ý cho bạn</p>}
                {/* Items */}
                {
                    value && (
                        loading ? array(5).map((_, i) => <CartItemLoading key={i} />) :
                            products.length > 0 ?
                                products.map(e => <CartItem key={e.id} {...e} />) : <div className="modal-body border">
                                    {/* Text */}
                                    <p className="mb-3 font-size-sm text-center">
                                        Rất tiếc không tìm thấy sản phẩm phù hợp với tiêu chí của bạn
                                    </p>
                                    <p className="mb-0 font-size-sm text-center">
                                        😞
                                    </p>
                                </div>
                    )
                }
                {/* Button */}
                <Link onClick={onClose} className="btn btn-link px-0 text-reset" to={viewAllLink}>
                    Tất cả sản phẩm<i className="fe fe-arrow-right ml-2" />
                </Link>
            </div>
            {/* Body: Empty (remove `.d-none` to disable it) */}

        </Drawer>
    )
}


const CartItem = ({ name, real_price, price, slug, id, images }) => {

    const salePrice = price - real_price

    return (
        <div className="row align-items-center position-relative mb-5">
            {
                salePrice > 0 && <div className="card-sale badge badge-dark card-badge card-badge-left text-uppercase">
                    - {Math.floor(salePrice / price * 100)}%
                </div>
            }
            <div className="col-4 col-md-3">
                {/* Image */}
                <img className="img-fluid" src={images?.[0]?.thumbnail_url} alt="..." />
            </div>
            <div className="col position-static">
                {/* Text */}
                <div className="mb-0 font-weight-bold">
                    <a className="stretched-link text-body" href="./product.html">{name}</a> <br />
                    <div className="card-product-price">
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
        </div>
    )
}

const CartItemLoading = () => {
    return (
        <div className="row align-items-center position-relative mb-5">
            <div className="col-4 col-md-3">
                {/* Image */}
                <Skeleton width={73} height={100} />
            </div>
            <div className="col position-static">
                {/* Text */}
                <div className="mb-0 font-weight-bold">
                    <a className="stretched-link text-body" href="#">
                        <Skeleton height={42.5} />
                    </a> <br />
                    <span className="text-muted">
                        <Skeleton width={150} height={20} />
                    </span>
                </div>
            </div>
        </div>
    )
}