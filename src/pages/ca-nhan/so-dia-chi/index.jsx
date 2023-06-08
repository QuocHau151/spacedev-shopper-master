import { AddressCard, AddressCardLoading } from '@/components/AddressCard'
import { Portal } from '@/components/Portal'
import Skeleton from '@/components/Skeleton'
import { PROFILE_HEADER_SELECTOR } from '@/config'
import { PATH } from '@/config/path'
import { useQuery } from '@/hooks/useQuery'
import { userService } from '@/services/user'
import { array } from '@/utils/array'
import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

export default function Address() {
    const { loading, data: { data = [] } = {}, callBackgroundApi } = useQuery({
        queryFn: () => userService.getAddress(),
        onSuccess: (res) => {
            res.data.sort(e => e.default ? -1 : 0)
        }
    })

    const onRefetch = () => callBackgroundApi()

    return (
        <>
            <Helmet>
                <title>Sổ địa chỉ</title>
            </Helmet>
            <Portal selector={PROFILE_HEADER_SELECTOR}>
                Sổ địa chỉ
            </Portal>
            <div className="row">
                {
                    loading ? array(3).map((_, i) => <div key={i} className="col-12">
                        <AddressCardLoading />
                    </div>) : data.length > 0 ? data.map(e => <div key={e._id} className="col-12 ">
                        <AddressCard onDelete={onRefetch} onChangeDefault={onRefetch} {...e} />
                    </div>) : <div className="col-12"><p className='text-xl border p-5 text-center'>Hiện bạn chưa có sổ địa chỉ nào, thêm sổ địa chỉ để sử dụng trong quá trình mua hàng được tốt hơn 😞</p></div>
                }

                {/* <div className="col-12 col-lg-6">
                <div className="card card-lg bg-light mb-8">
                    <div className="card-body">
                        <h6 className="mb-6">
                            Shipping Address
                        </h6>
                        <p className="text-muted mb-0">
                            Daniel Robinson <br />
                            3997 Raccoon Run <br />
                            Kingston <br />
                            45644 <br />
                            United States <br />
                            6146389574
                        </p>
                        <div className="card-action card-action-right gap-2 flex">
                            <a className="btn btn-xs btn-circle btn-white-primary" href="account-address-edit.html">
                                <i className="fe fe-edit-2" />
                            </a>
                            <button className="btn btn-xs btn-circle btn-white-primary">
                                <i className="fe fe-x" />
                            </button>
                        </div>
                    </div>
                </div>
            </div> */}
                <div className="col-12">
                    {/* Button */}
                    <Link className="btn btn-block btn-lg btn-outline-border" to={PATH.profile.newAddress}>
                        Add Address <i className="fe fe-plus" />
                    </Link>
                </div>
            </div>
        </>
    )
}
