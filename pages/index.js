import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { userService } from 'services'
import { useRouter } from 'next/router'

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
        const returnUrl = router.query.returnUrl || '/main'
        router.push(returnUrl)
      })
      .catch((err) => alert(err.response.data))
  }

  if (userService.userValue)
    return ''

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <input
          type="text" placeholder="Username"
          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
          { ...register('username') }
        />
      </div>
      <div className="form-group">
        <input
          type="password" placeholder="Password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          { ...register('password') }
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">Login</button>
    </form>
  )
}
