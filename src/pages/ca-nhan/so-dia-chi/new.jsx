import { Button } from '@/components/Button'
import { Checkbox } from '@/components/Checkbox'
import { Field } from '@/components/Field'
import { Form } from '@/components/Form'
import { Portal } from '@/components/Portal'
import { MESSAGE, WARNING } from '@/config/message'
import { PATH } from '@/config/path'
import { useQuery } from '@/hooks/useQuery'
import { userService } from '@/services/user'
import { handleError } from '@/utils/handleError'
import { isEqual } from '@/utils/object'
import { regexp, required } from '@/utils/rule'
import { Spin, message } from 'antd'
import React from 'react'
import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'

const rules = {
    fullName: [required()],
    phone: [required(), regexp('phone')],
    email: [required(), regexp('email')],
    province: [required()],
    district: [required()],
    address: [required()]
}

export default function AddressDetail() {
    const { id } = useParams()
    const navigate = useNavigate()

    const { data: { data: address = null } = {}, loading: dataLoading } = useQuery({
        queryFn: () => userService.getAddressDetail(id),
        enabled: !!id,
        limitDuration: 1000,
        onError: (err) => {
            handleError(err)
            navigate(PATH.profile.address)
        }
    })
    const { loading, refetch: newAddressService } = useQuery({
        queryFn: ({ params }) => userService.newAddress(...params),
        enabled: false
    })

    const { loading: editLoading, refetch: editAddressService } = useQuery({
        queryFn: ({ params }) => userService.editAddress(...params),
        enabled: false
    })

    const onSubmit = async (values) => {

        try {
            if (id) {

                if (isEqual(address, values)) {
                    return message.warning({
                        content: WARNING.NOT_HAVE_CHANGE_TO_EDIT,
                        key: 'warning'
                    })
                }
                await editAddressService(id, values)
                message.success(MESSAGE.EDIT_ADDRESS_SUCCESS)
            } else {
                await newAddressService(values)
                message.success(MESSAGE.ADD_ADDRESS_SUCCESS)
            }
            navigate(PATH.profile.address)
        } catch (err) {
            handleError(err)
        }
    }

    return (
        <>
            <Portal selector="#main-profile-title">
                Sổ địa chỉ
            </Portal>
            <Helmet>
                <title>Sổ địa chỉ</title>
            </Helmet>
            {/* Heading */}
            <h6 className="mb-7">
                {id ? 'Edit Address' : 'Add Address'}
            </h6>
            {/* Form */}
            <Spin spinning={dataLoading}>
                <Form form={{ rules, initialValue: address }} onSubmit={onSubmit}>
                    <div className="row">
                        <div className="col-12">
                            <Form.Item name="fullName">
                                <Field
                                    label="Full Name *"
                                    placeholder="Full Name *"
                                />
                            </Form.Item>
                        </div>
                        <div className="col-12 col-md-6">
                            <Form.Item name="phone">
                                <Field
                                    label="Phone Number*"
                                    placeholder="Phone Number*"

                                />
                            </Form.Item>
                        </div>
                        <div className="col-12 col-md-6">
                            <Form.Item name="email">
                                <Field
                                    label="Email Address *"
                                    placeholder="Email Address *"

                                />
                            </Form.Item>
                        </div>
                        <div className="col-12 col-md-6">
                            <Form.Item name="district">
                                <Field
                                    label="District *"
                                    placeholder="District *"

                                />
                            </Form.Item>
                        </div>
                        <div className="col-12 col-md-6">
                            <Form.Item name="province">
                                <Field
                                    label="Province / City*"
                                    placeholder="Province / City*"

                                />
                            </Form.Item>
                        </div>
                        <div className="col-12">
                            <Form.Item name="address">
                                <Field
                                    label="Address *"
                                    placeholder="Address *"

                                />
                            </Form.Item>
                        </div>
                        <div className="col-12">
                            <Form.Item name="default">
                                <Field
                                    renderField={(props) => <Checkbox
                                        checked={props.value}
                                        {...props}
                                        onChange={ev => {
                                            if (address) {
                                                if (address.default) {
                                                    message.warning('Bạn không thể bỏ địa chỉ mặc định')
                                                    return
                                                }
                                            }
                                            props?.onChange(ev)
                                        }}
                                    >Default shipping address</Checkbox>}
                                />
                            </Form.Item>
                        </div>
                    </div>
                    {/* Button */}
                    <Button loading={loading || editLoading}>
                        {id ? 'Edit Address' : 'Add Address'}
                    </Button>

                </Form>
            </Spin>

        </>
    )
}
