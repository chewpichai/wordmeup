import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { userService } from 'services'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Word is required'),
    password: Yup.string().required('POS is required.'),
  })
  const formOptions = { resolver: yupResolver(validationSchema) }
  const { register, handleSubmit, formState } = useForm(formOptions)
  const { errors } = formState
  const router = useRouter();

  function onSubmit(data) {
    return userService.login(data)
      .then((user) => {
        if (user.isAdmin)
          return router.push('/admin/user')
        const returnUrl = router.query.returnUrl || user.numPerDay ? '/' : '/howto'
        router.push(returnUrl)
      })
      .catch((err) => alert(err.response.data))
  }

  if (userService.userValue) {
    return (
      <div className="text-center">
        <h5>Welcome Back!</h5>
        <div className="d-flex my-4 text-lobby">
          <p className="flex-fill align-self-center">New words are waiting for you.<br/>Ready?<br/><button className="btn btn-sm btn-success-gradient mt-2"><Link href="/main">Yes</Link></button></p>
        </div>
      </div>
    )
  }

  return (
    <>
    <form className="mb-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <input
          type="text" placeholder="Username"
          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
          { ...register('username') }
        />
        <div className="invalid-feedback">{errors.username?.message}</div>
      </div>
      <div className="form-group">
        <input
          type="password" placeholder="Password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          { ...register('password') }
        />
        <div className="invalid-feedback">{errors.password?.message}</div>
      </div>
      <button type="submit" className="btn btn-primary pill w-100" disabled={formState.isSubmitting}>
        {formState.isSubmitting && <div className="spinner-border spinner-border-sm mr-1"/>}
        Login
      </button>
    </form>

    <div className="text-center">
      <Image src="/state-login.png" width="737" height="400"/>
    </div>
    </>
  )
}
