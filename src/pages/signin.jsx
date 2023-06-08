import { Button } from "@/components/Button"
import { Field } from "@/components/Field"
import { useForm } from "@/hooks/useForm"
import { userService } from "@/services/user"
import { useQuery } from '@/hooks/useQuery'
import { confirm, minMax, password, regexp, required, requiredLetter } from "@/utils/rule"
import { handleError } from "@/utils/handleError"
import { message } from "antd"
import { useAsync } from "@/hooks/useAsync"
import { Checkbox } from "@/components/Checkbox"
import { authService } from "@/services/auth"
import { useDispatch, useSelector } from "react-redux"
import { useAuth } from "@/hooks/useAuth"
import { loginThunkAction } from "@/stories/auth"
import { useEffect } from "react"
import { useBodyClass } from "@/hooks/useBodyClass"
import { copyToClipboard } from '@/utils/copyToClipboard'


const registerRule = {
    name: [required(), requiredLetter(2)],
    username: [required(), regexp('email')],
    password: [required(), minMax(6, 32), password(1)],
    confirmPassword: [confirm('password')]
}

const loginRule = {
    username: [required(), regexp('email')],
    password: [required(), minMax(6, 32), password(1)]
}


export default function Account() {
    useBodyClass('bg-light')

    const dispatch = useDispatch()
    const { loginLoading } = useAuth()
    const registerForm = useForm(registerRule, {
        dependencies: {
            password: ['confirmPassword']
        }
    })

    const loginForm = useForm(loginRule)

    const { refetch: registerService, loading: registerLoading } = useQuery({
        queryFn: ({ params }) => userService.register(...params),
        enabled: false,
        limitDuration: 1000
    })

    const onSubmitRegister = async (ev) => {
        const startTime = Date.now()

        try {
            ev.preventDefault()
            if (registerForm.validate()) {
                const res = await registerService(registerForm.values)
                if (res.message) {
                    message.success(res.message)
                }
            }
        } catch (err) {
            handleError(err)
        }
        const endTime = Date.now()
        console.log(endTime - startTime)

    }

    const onSubmitLogin = async () => {
        if (loginForm.validate()) {
            try {
                await dispatch(loginThunkAction(loginForm.values)).unwrap()
            } catch (err) {
                handleError(err)
            }
        }
    }

    const _copyToClipboard = async (ev) => {
        await copyToClipboard(ev.target.innerText)
        message.info('Copy to Clipboard')
    }

    return (
        <section className="py-12">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-6">
                        {/* Card */}
                        <div className="card card-lg mb-10 mb-md-0">
                            <div className="card-body">
                                {/* Heading */}
                                <h6 className="mb-7">Returning Customer</h6>
                                {/* Form */}
                                <div>
                                    <div className="row">

                                        <div className="col-12">
                                            {/* Email */}
                                            <Field {...loginForm.register('username')} placeholder="Email Address *" />
                                            {/* <div className="form-group">
                                                <label className="sr-only" htmlFor="loginEmail">
                                                    Email Address *
                                                </label>
                                                <input className="form-control form-control-sm" id="loginEmail" type="email" placeholder="Email Address *" required />
                                            </div> */}
                                        </div>
                                        <div className="col-12">
                                            {/* Password */}

                                            <Field {...loginForm.register('password')} type="password" placeholder="Password *" />

                                            {/* <div className="form-group">
                                                <label className="sr-only" htmlFor="loginPassword">
                                                    Password *
                                                </label>
                                                <input className="form-control form-control-sm" id="loginPassword" type="password" placeholder="Password *" required />
                                            </div> */}
                                        </div>
                                        <div className="col-12 col-md">
                                            {/* Remember */}
                                            <Field
                                                {...loginForm.register('remember')}
                                                renderField={(props) => <Checkbox {...props}>Remember me</Checkbox>}
                                            />
                                            {/* <div className="form-group">
                                                <div className="custom-control custom-checkbox">
                                                    <input className="custom-control-input" id="loginRemember" type="checkbox" />
                                                    <label className="custom-control-label" htmlFor="loginRemember">
                                                        Remember me
                                                    </label>
                                                </div>
                                            </div> */}
                                        </div>
                                        <div className="col-12 col-md-auto">
                                            {/* Link */}
                                            <div className="form-group">
                                                <a className="font-size-sm text-reset" data-toggle="modal" href="#modalPasswordReset">Forgot
                                                    Password?</a>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            {/* Button */}
                                            <Button loading={loginLoading} onClick={onSubmitLogin}>
                                                Sign In
                                            </Button>
                                        </div>
                                        <div className="col-12">
                                            <p className="font-size-sm text-muted mt-5 mb-2 font-light">Tài khoản demo: <b className="text-black"><span className="cursor-pointer underline" onClick={_copyToClipboard}>demo@spacedev.com</span> / <span onClick={_copyToClipboard} className="cursor-pointer underline">Spacedev@123</span></b></p>
                                            <p className="font-size-sm text-muted mt-5 mb-2 font-light text-justify">
                                                Chúng tôi cung cấp cho bạn tài khoản demo vì mục đích học tập, để đảm bảo những người khác có thể sử dụng chung tài khoản chúng tôi sẽ
                                                hạn chế rất nhiều quyền trên tài khoản này ví dụ:  <br />
                                                - Không thay đổi thông tin cá nhân, mật khẩu <br />
                                                - không reset password,... <br /><br />
                                                Để có thể sử dụng toàn bộ chức năng trên website, vui lòng tiến hành <b className="text-black">đăng ký</b> bằng tài khoản email có thật
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        {/* Card */}
                        <div className="card card-lg">
                            <div className="card-body">
                                {/* Heading */}
                                <h6 className="mb-7">New Customer</h6>
                                {/* Form */}
                                <form onSubmit={onSubmitRegister}>
                                    <div className="row">
                                        <div className="col-12">
                                            {/* Email */}
                                            <Field {...registerForm.register('name')} placeholder="Full Name *" />
                                        </div>
                                        <div className="col-12">
                                            {/* Email */}
                                            {/* <div className="form-group">
                                                <label className="sr-only" htmlFor="registerEmail">
                                                    Email Address *
                                                </label>
                                                <input className="form-control form-control-sm" id="registerEmail" type="email" placeholder="Email Address *" required />
                                            </div> */}
                                            <Field {...registerForm.register('username')} placeholder="Email Address *" />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            {/* Password */}
                                            {/* <div className="form-group">
                                                <label className="sr-only" htmlFor="registerPassword">
                                                    Password *
                                                </label>
                                                <input className="form-control form-control-sm" id="registerPassword" type="password" placeholder="Password *" required />
                                            </div> */}
                                            <Field {...registerForm.register('password')} placeholder="Password *" type="password" />
                                        </div>
                                        <div className="col-12 col-md-6">
                                            {/* Password */}
                                            {/* <div className="form-group">
                                                <label className="sr-only" htmlFor="registerPasswordConfirm">
                                                    Confirm Password *
                                                </label>
                                                <input className="form-control form-control-sm" id="registerPasswordConfirm" type="password" placeholder="Confrm Password *" required />
                                            </div> */}
                                            <Field {...registerForm.register('confirmPassword')} placeholder="Confirm Password *" type="password" />

                                        </div>
                                        <div className="col-12 col-md-auto">
                                            {/* Link */}
                                            <div className="form-group font-size-sm text-muted font-light">
                                                By registering your details, you agree with our Terms &amp; Conditions,
                                                and Privacy and Cookie Policy.
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            {/* Button */}
                                            <Button loading={registerLoading}>
                                                Register
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}



