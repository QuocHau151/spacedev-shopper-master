import { GuestRoute } from "@/components/GuestRoute";
import { PATH } from "@/config/path";
import { MainLayout } from "@/layouts/MainLayout";
import { lazy } from "react";
import { profile } from "./ca-nhan";

const Home = lazy(() => import('@/pages'))
const Page404 = lazy(() => import('@/pages/404'))
const Account = lazy(() => import('@/pages/signin'))
const Product = lazy(() => import('@/pages/san-pham'))
const ProductDetail = lazy(() => import('@/pages/[slug]'))
const Category = lazy(() => import('@/pages/[slug]/[id]'))
const Contact = lazy(() => import('@/pages/lien-he'))
const FAQ = lazy(() => import('@/pages/hoi-dap'))
const About = lazy(() => import('@/pages/ve-chung-toi'))
const Shipping = lazy(() => import('@/pages/quy-dinh-giao-hang'))


export const routers = [
    {
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                element: <Product />,
                path: PATH.product
            },
            {
                element: <ProductDetail />,
                path: PATH.productDetail
            },
            {
                element: <Product />,
                path: PATH.category
            },
            {
                element: <Contact />,
                path: PATH.contact
            },
            {
                element: <FAQ />,
                path: PATH.faq
            },
            {
                element: <About />,
                path: PATH.about
            },
            {
                element: <Shipping />,
                path: PATH.shipping
            },
            profile,
            {
                element: <GuestRoute redirect={PATH.profile.index} />,
                children: [
                    {
                        element: <Account />,
                        path: PATH.account
                    }
                ]
            },
            {
                element: <Page404 />,
                path: '*'
            }
        ]
    }
]