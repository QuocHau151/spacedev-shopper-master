import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Form } from "@/components/Form";
import { Portal } from "@/components/Portal";
import { Radio } from "@/components/Radio";
import { UploadFile } from "@/components/UploadFile";
import { avatarDefault } from "@/config/assets";
import { MESSAGE } from "@/config/message";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@/hooks/useQuery";
import { fileService } from "@/services/file";
import { userService } from "@/services/user";
import { authActions, setUserAction } from "@/stories/auth";
import { handleError } from "@/utils/handleError";
import { isEqual } from "@/utils/object";
import { confirm, minMax, password, regexp, required, requiredLetter } from "@/utils/rule";
import { validate } from "@/utils/validate";
import { DatePicker, message } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { useDispatch } from "react-redux";

const rules = {
    name: [required(), requiredLetter(2)],
    phone: [required(), regexp('phone')],
    currentPassword: [
        (_, values) => {
            if (values.newPassword) {
                const errorObj = validate({
                    currentPassword: [required(), minMax(6, 32), password(1)]
                }, values)
                return errorObj.currentPassword
            }
        }
    ],
    newPassword: [
        (value, values) => {
            if (values.currentPassword) {
                if (value === values.currentPassword) return 'Vui lòng không điền giống mật khẩu cũ'
                const errorObj = validate({
                    newPassword: [required(), minMax(6, 32), password(1)]
                }, values)
                return errorObj.newPassword
            }
        }
    ],
    confirmPassword: [confirm('newPassword')]
}

export default function Profile() {
    const { user } = useAuth()
    const dispatch = useDispatch()
    const fileRef = useRef()

    const { refetch: updateProfileService, loading: updateProfileLoading } = useQuery({
        queryFn: ({ params }) => userService.updateProfile(...params),
        enabled: false
    })

    const { refetch: changePasswordService, loading: changePasswordLoading } = useQuery({
        queryFn: ({ params }) => userService.changePassword(...params),
        enabled: false
    })

    const { refetch: uploadFileService, loading: uploadFileLoading } = useQuery({
        queryFn: ({ params }) => fileService.upload(...params),
        enabled: false
    })

    const onSubmit = async (values, form) => {
        let avatar
        try {
            if (fileRef.current) {
                const res = await uploadFileService(fileRef.current)
                avatar = res.link


            }
        } catch (err) {
            console.error(err)
            handleError(err)
            return
        }


        if (avatar || !isEqual(values, user, 'phone', 'name', 'birthday', 'gender')) {
            updateProfileService({
                phone: values.phone,
                name: values.name,
                birthday: values.birthday,
                gender: values.gender,
                avatar
            }).then(res => {
                dispatch(setUserAction(res.data))
                message.success(MESSAGE.UPDATE_PROFILE_SUCCESS)
                fileRef.current = null
            }).catch(handleError)
        } else if (!values.newPassword) {
            message.warning(MESSAGE.WARNING_NOTHING_CHANGE)
        }



        if (values.newPassword) {
            changePasswordService({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword
            }).then(res => {
                form.setValues({ ...user, newPassword: '', currentPassword: '', confirmPassword: '' })
                message.success(MESSAGE.CHANGE_PASSWORD_SUCCESS)
            }).catch(handleError)
        }
    }


    return (
        <Form
            form={{
                initialValue: user,
                rules,
                dependencies: {
                    currentPassword: ['newPassword'],
                    newPassword: ['currentPassword', 'confirmPassword']
                }
            }}
            rules={rules} onSubmit={onSubmit}>
            <Portal selector="#main-profile-title">
                Thông tin cá nhân
            </Portal>
            <div className="row">
                <div className="col-12">
                    <div className="profile-avatar">
                        <UploadFile onChange={(file) => fileRef.current = file} >
                            {({ previewSrc, triggerEvent }) => (
                                <div className="wrap" onClick={triggerEvent}>
                                    <img src={previewSrc || user.avatar || avatarDefault} />
                                    <i className="icon">
                                        <img src="./img/icons/icon-camera.svg" />
                                    </i>
                                </div>
                            )}
                        </UploadFile>

                    </div>
                </div>
                <div className="col-12">
                    <Form.Item name="name">
                        <Field label="Full Name *" placeholder="Full Name *" />
                    </Form.Item>
                    {/* <div className="form-group">
                        <label htmlFor="accountFirstName">
                            Full Name *
                        </label>
                        <input className="form-control form-control-sm" id="accountFirstName" type="text" placeholder="Full Name *" defaultValue="Daniel" required />
                    </div> */}
                </div>
                <div className="col-md-6">
                    {/* Email */}
                    <Form.Item name="phone">
                        <Field label="Phone Number *" placeholder="Phone Number *" />
                    </Form.Item>
                    {/* <div className="form-group">
                        <label htmlFor="accountEmail">
                            Phone Number *
                        </label>
                        <input className="form-control form-control-sm" id="accountEmail" type="email" placeholder="Phone Number *" required />
                    </div> */}
                </div>
                <div className="col-md-6">
                    {/* Email */}
                    <Form.Item name="username">
                        <Field disabled label="Email Address *" placeholder="Email Address *" />
                    </Form.Item>
                    {/* <div className="form-group">
                        <label htmlFor="accountEmail">
                            Email Address *
                        </label>
                        <input disabled className="form-control form-control-sm" id="accountEmail" type="email" placeholder="Email Address *" defaultValue="support@spacedev.com" required />
                    </div> */}
                </div>
                <div className="col-12 col-md-12">
                    {/* Password */}
                    <Form.Item name="currentPassword">
                        <Field label="Current Password" autoComplete="new-password" type="password" placeholder="Current Password" />
                    </Form.Item>
                    {/* <div className="form-group">
                        <label htmlFor="accountPassword">
                            Current Password *
                        </label>
                        <input className="form-control form-control-sm" id="accountPassword" type="password" placeholder="Current Password *" required />
                    </div> */}
                </div>
                <div className="col-12 col-md-6">
                    <Form.Item name="newPassword">
                        <Field label="New Password" autoComplete="new-password" type="password" placeholder="New Password" />
                    </Form.Item>
                    {/* <div className="form-group">
                        <label htmlFor="AccountNewPassword">
                            New Password *
                        </label>
                        <input className="form-control form-control-sm" id="AccountNewPassword" type="password" placeholder="New Password *" required />
                    </div> */}
                </div>
                <div className="col-12 col-md-6">
                    <Form.Item name="confirmPassword">
                        <Field label="Confirm Password" autoComplete="new-password" type="password" placeholder="Confirm Password" />
                    </Form.Item>
                    {/* <div className="form-group">
                        <label htmlFor="AccountNewPassword">
                            New Password *
                        </label>
                        <input className="form-control form-control-sm" id="AccountNewPassword" type="password" placeholder="New Password *" required />
                    </div> */}
                </div>
                <div className="col-12 col-lg-6">
                    <Form.Item name="birthday">
                        <Field
                            label="Date of Birth"
                            renderField={(props) => <DatePicker className="form-control form-control-sm" {...props} value={props.value ? dayjs(props.value) : undefined} onChange={(_, dateString) => props?.onChange({ target: { value: dateString } })} style={{ width: '100%', height: 50.5 }} />}
                        />
                    </Form.Item>
                    {/* <div className="form-group">
                        <label>Date of Birth</label>
                        <input className="form-control form-control-sm" type="date" placeholder="dd/mm/yyyy" />
                    </div> */}
                </div>
                <div className="col-12 col-lg-6">
                    {/* Gender */}
                    <Form.Item name="gender">
                        <Field
                            label="Gender"
                            renderField={(props) => (
                                <Radio.Group {...props} toggle>
                                    <Radio.Toggle value="male">Male</Radio.Toggle>
                                    <Radio.Toggle value="female">Female</Radio.Toggle>
                                </Radio.Group>
                            )}
                        />
                    </Form.Item>
                    {/* <div className="form-group mb-8">
                        <label>Gender</label>
                        <div className="btn-group-toggle" data-toggle="buttons">
                            <label className="btn btn-sm btn-outline-border active">
                                <input type="radio" name="gender" defaultChecked /> Male
                            </label>
                            <label className="btn btn-sm btn-outline-border">
                                <input type="radio" name="gender" /> Female
                            </label>
                        </div>
                    </div> */}
                </div>
                <div className="col-12">
                    {/* Button */}
                    <Button loading={uploadFileLoading || updateProfileLoading || changePasswordLoading}>Save Changes</Button>
                </div>
            </div>
        </Form>
    )
}
