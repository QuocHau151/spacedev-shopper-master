import { Paginate } from "@/components/Paginate";
import { ProductCard, ProductCardLoading } from "@/components/ProductCard";
import { useQuery } from "@/hooks/useQuery";
import { productService } from "@/services/product";
import { array } from "@/utils/array";
import { Link, NavLink, generatePath, useLocation, useMatch, useParams, useSearchParams } from "react-router-dom";
import querString from 'query-string'
import { Helmet } from "react-helmet";
import { useEffect, useRef, useState } from "react";
import Skeleton from "@/components/Skeleton";
import { PATH } from "@/config/path";
import { slugify } from "@/utils/slugify";
import { cn } from "@/utils";
import { useCategories, useCategory } from "@/hooks/useCategories";
import { useSearch } from "@/hooks/useSearch";
import { useDidUpdateEffect } from "@/hooks/useDidUpdateEffect";
import { Radio } from "@/components/Radio";


export default function Product() {

    const [search, setSearch] = useSearch({
        page: 1,
        // search: undefined,
        sort: 'newest',
        // minPrice: undefined,
        // maxPrice: undefined
    })

    const [minPrice, setMinPrice] = useState(search.minPrice || '')
    const [maxPrice, setMaxPrice] = useState(search.maxPrice || '')


    // const [search, setSearchParam] = useSearchParams()
    const match = useMatch(PATH.category)
    const category = useCategory(parseInt(match?.params?.id || '0'))

    // const currentPage = search.get('page') || 1
    // const searchKeyWord = search.get('search')
    // const sort = search.get('sort') || 'newest'

    const query = querString.stringify({
        page: search.page,
        categories: match?.params?.id,
        name: search.search || undefined,
        sort: search.sort,
        minPrice: search.minPrice || undefined,
        maxPrice: search.maxPrice || undefined,
        filter_rating: search.filter_rating || undefined
    })



    const { data: { data: products = [], paginate = {} } = {}, loading } = useQuery({
        queryFn: ({ signal }) => productService.getProduct(`${query ? `?${query}` : ''}`, signal),
        queryKey: [query, search.page],
        keepPreviousData: true,
    })


    const { data: categories, loading: categoryLoading } = useCategories()

    // Chỉ run kể từ lần thứ 2 trở đi
    useDidUpdateEffect(() => {
        setMinPrice('')
        setMaxPrice('')
    }, [match?.params?.id])


    const onChangeFilterRating = (ev) => {
        setSearch({
            filter_rating: ev.target.value || undefined
        })
    }
    return (
        <section className="py-11">
            <Helmet>
                <title>Sản phẩm</title>
            </Helmet>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-4 col-lg-3">
                        {/* Filters */}
                        <div className="mb-10 mb-md-0">
                            <ul className="nav nav-vertical" id="filterNav">
                                <li className="nav-item">
                                    {/* Toggle */}
                                    <a className="nav-link font-size-lg text-reset border-bottom mb-6" href="#categoryCollapse">
                                        Category
                                    </a>
                                    {/* Collapse */}
                                    <div>
                                        <div className="form-group">
                                            <ul className="list-styled mb-0" id="productsNav">

                                                <li className="list-styled-item">
                                                    <NavLink className={({ isActive }) => cn('list-styled-link', { 'font-bold': isActive })} to={PATH.product}>
                                                        Tất cả sản phẩm
                                                    </NavLink>
                                                </li>
                                                {
                                                    categoryLoading ? array(10).map((_, i) => (
                                                        <li key={i} className="list-styled-item">
                                                            <Skeleton height={24} />
                                                        </li>
                                                    )) :
                                                        categories.map(e => (
                                                            <li key={e.id} className="list-styled-item">
                                                                {/* Toggle */}
                                                                <NavLink className={({ isActive }) => cn('list-styled-link', { 'font-bold': isActive })} to={generatePath(PATH.category, { slug: slugify(e.title), id: e.id })}>
                                                                    {e.title}
                                                                </NavLink>
                                                            </li>
                                                        ))
                                                }

                                            </ul>
                                        </div>
                                    </div>
                                </li>
                                <li className="nav-item">
                                    {/* Toggle */}
                                    <a className="nav-link font-size-lg text-reset border-bottom mb-6" href="#seasonCollapse">
                                        Rating
                                    </a>
                                    {/* Collapse */}
                                    <div>
                                        <Radio.Group
                                            value={search.filter_rating}
                                            onChange={onChangeFilterRating}
                                            onCheckedWhen2nd={() => {
                                                setSearch({ filter_rating: undefined })
                                            }}
                                        >
                                            <div className="form-group form-group-overflow mb-6" id="seasonGroup">
                                                <div className="custom-control custom-radio mb-3">
                                                    <Radio value="5">
                                                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                        <span className="text-small inline-block ml-2">from 5 star</span>
                                                    </Radio>
                                                </div>
                                                <div className="custom-control custom-radio mb-3">
                                                    <Radio value="4">
                                                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={14} height={14} viewBox="0 0 12 12" className="star-icon"><g fill="none" fillRule="evenodd"><path fill="#b8b8b8" transform="matrix(-1 0 0 1 11 1)" d="M5 0v8.476L1.91 10l.424-3.562L0 3.821l3.353-.678L5 0z" /><path fill="#b8b8b8" transform="translate(1 1)" d="M5 0v8.476L1.91 10l.424-3.562L0 3.821l3.353-.678L5 0z" /></g></svg>
                                                        <span className="text-small inline-block ml-2">from 4 star</span>
                                                    </Radio>
                                                </div>
                                                <div className="custom-control custom-radio">
                                                    <Radio value="3">
                                                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" size={14} color="#fdd836" height={14} width={14} xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(253, 216, 54)' }}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" /></svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={14} height={14} viewBox="0 0 12 12" className="star-icon"><g fill="none" fillRule="evenodd"><path fill="#b8b8b8" transform="matrix(-1 0 0 1 11 1)" d="M5 0v8.476L1.91 10l.424-3.562L0 3.821l3.353-.678L5 0z" /><path fill="#b8b8b8" transform="translate(1 1)" d="M5 0v8.476L1.91 10l.424-3.562L0 3.821l3.353-.678L5 0z" /></g></svg>
                                                        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={14} height={14} viewBox="0 0 12 12" className="star-icon"><g fill="none" fillRule="evenodd"><path fill="#b8b8b8" transform="matrix(-1 0 0 1 11 1)" d="M5 0v8.476L1.91 10l.424-3.562L0 3.821l3.353-.678L5 0z" /><path fill="#b8b8b8" transform="translate(1 1)" d="M5 0v8.476L1.91 10l.424-3.562L0 3.821l3.353-.678L5 0z" /></g></svg>
                                                        <span className="text-small inline-block ml-2">from 3 star</span>
                                                    </Radio>
                                                </div>
                                            </div>
                                        </Radio.Group>
                                    </div>
                                </li>
                                <li className="nav-item">
                                    {/* Toggle */}
                                    <a className="nav-link font-size-lg text-reset border-bottom mb-6" data-toggle="collapse" href="#priceCollapse">
                                        Giá
                                    </a>
                                    {/* Collapse */}
                                    <div>
                                        {/* Range */}
                                        <div className="d-flex align-items-center">
                                            {/* Input */}
                                            <input value={minPrice} onChange={ev => setMinPrice(ev.target.value)} type="number" className="form-control form-control-xs" placeholder="Thấp nhất" min={10} />
                                            {/* Divider */}
                                            <div className="text-gray-350 mx-2">‒</div>
                                            {/* Input */}
                                            <input value={maxPrice} onChange={ev => setMaxPrice(ev.target.value)} type="number" className="form-control form-control-xs" placeholder="Cao nhất" max={350} />
                                        </div>
                                        <button className="btn btn-outline-dark btn-block mt-5" onClick={() => {
                                            setSearch({
                                                minPrice: minPrice || undefined,
                                                maxPrice: maxPrice || undefined
                                            })
                                        }}>Áp dụng</button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-12 col-md-8 col-lg-9">
                        {/* Slider */}
                        {/* <div className="flickity-page-dots-inner mb-9" data-flickity="{&quot;pageDots&quot;: true}">
                            <div className="w-100">
                                <div className="card bg-h-100 bg-left" style={{ backgroundImage: 'url(/img/covers/cover-24.jpg)' }}>
                                    <div className="row" style={{ minHeight: '400px' }}>
                                        <div className="col-12 col-md-10 col-lg-8 col-xl-6 align-self-center">
                                            <div className="card-body px-md-10 py-11">
                                                <h4>
                                                    2019 Summer Collection
                                                </h4>
                                                <a className="btn btn-link px-0 text-body" href="shop.html">
                                                    View Collection <i className="fe fe-arrow-right ml-2" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-2 col-lg-4 col-xl-6 d-none d-md-block bg-cover" style={{ backgroundImage: 'url(/img/covers/cover-16.jpg)' }} />
                                    </div>
                                </div>
                            </div>
                            <div className="w-100">
                                <div className="card bg-cover" style={{ backgroundImage: 'url(/img/covers/cover-29.jpg)' }}>
                                    <div className="row align-items-center" style={{ minHeight: '400px' }}>
                                        <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                                            <div className="card-body px-md-10 py-11">
                                                <h4 className="mb-5">Get -50% from Summer Collection</h4>
                                                <p className="mb-7">
                                                    Appear, dry there darkness they're seas. <br />
                                                    <strong className="text-primary">Use code 4GF5SD</strong>
                                                </p>
                                                <a className="btn btn-outline-dark" href="shop.html">
                                                    Shop Now <i className="fe fe-arrow-right ml-2" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-100">
                                <div className="card bg-cover" style={{ backgroundImage: 'url(/img/covers/cover-30.jpg)' }}>
                                    <div className="row align-items-center" style={{ minHeight: '400px' }}>
                                        <div className="col-12">
                                            <div className="card-body px-md-10 py-11 text-center text-white">
                                                <p className="text-uppercase">Enjoy an extra</p>
                                                <h1 className="display-4 text-uppercase">50% off</h1>
                                                <a className="link-underline text-reset" href="shop.html">Shop Collection</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* Header */}
                        <div className="row align-items-center mb-7">
                            <div className="col-12 col-md">
                                {/* Heading */}
                                <h3 className="mb-1">{category?.title || 'Tất cả sản phẩm'}</h3>
                                {/* Breadcrumb */}
                                <ol className="breadcrumb mb-md-0 font-size-xs text-gray-400">
                                    <li className="breadcrumb-item">
                                        <a className="text-gray-400" href="index.html">Home</a>
                                    </li>
                                    <li className="breadcrumb-item active">
                                        Women's Clothing
                                    </li>
                                </ol>
                            </div>
                            <div className="col-12 col-md-auto flex gap-1 items-center whitespace-nowrap">
                                {/* Select */}
                                Sắp xếp theo:
                                <select
                                    value={search.sort} onChange={ev => {
                                        // search.set('sort', ev.target.value)
                                        // search.set('page', 1)
                                        // setSearchParam(search)
                                        setSearch({
                                            sort: ev.target.value,
                                            page: 1
                                        })
                                    }}
                                    className="custom-select custom-select-xs">
                                    <option value="newest">Mới nhất</option>
                                    <option value="real_price.desc">Giá giảm dần</option>
                                    <option value="real_price.asc">Giá tăng dần</option>
                                    <option value="discount_rate.desc">Giảm giá nhiều nhất</option>
                                    <option value="rating_average.desc">Đánh giá cao nhất</option>
                                    <option value="top_seller">Mua nhiều nhất</option>
                                </select>
                            </div>
                        </div>
                        {
                            search.search && <h4 className="mb-5 text-2xl">Tìm kiếm `{search.search}`</h4>
                        }

                        {/* Products */}
                        <div className="row">
                            {
                                loading ? array(15).map((_, i) => <div className="col-6 col-md-4" key={i}><ProductCardLoading /></div>) :
                                    products.length > 0 ? products.map(e => <div className="col-6 col-md-4" key={e.id}><ProductCard showWishlist  {...e} /></div>) : (
                                        <div className="col-12">
                                            <div className="modal-body border ">
                                                {/* Text */}
                                                <p className="mb-3 font-size-sm text-center">
                                                    Rất tiếc không tìm thấy sản phẩm phù hợp với tiêu chí của bạn
                                                </p>
                                                <p className="mb-0 font-size-sm text-center">
                                                    😞
                                                </p>
                                            </div>
                                        </div>
                                    )
                            }
                        </div>
                        {/* Pagination */}
                        <Paginate totalPage={paginate.totalPage} />
                        {/* <Paginate name="paginate" totalPage={paginate.totalPage} /> */}
                    </div>
                </div>
            </div>
        </section>
    )
}
