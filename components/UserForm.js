import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import moment from 'moment'
import { useEffect } from 'react'

export function UserForm({ user, onSave }) {
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required.'),
    firstName: Yup.string().required('First name is required.'),
    lastName: Yup.string().required('Last Name is required.'),
    email: Yup.string().required('email is required.'),
    course: Yup.string().required('course is required.'),
    courseType: Yup.string().required('Course type is required.'),
    startDate: Yup.string().required('Start date is required.'),
    endDate: Yup.string().required('End date is required.'),
  }) 
  const formOptions = {
    defaultValues: validationSchema.cast({
      ...user,
      startDate: moment(user.startDate).format('YYYY-MM-DD'),
      endDate: moment(user.endDate).format('YYYY-MM-DD'),
    }),
    resolver: yupResolver(validationSchema)
  }
  const { register, handleSubmit, formState, reset } = useForm(formOptions)
  const { errors } = formState

  useEffect(() => {
    reset(formOptions.defaultValues)
  }, [user])

  function onSubmit(data) {
    if (user._id) {
      axios.put(`/api/user/${user._id}`, data)
        .then(response => {
          onSave(response.data)
        })
    } else {
      axios.post('/api/user', data)
        .then(response => {
          onSave(response.data)
        })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
          type="text" placeholder="Password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          { ...register('password') }
        />
        <div className="invalid-feedback">{errors.password?.message}</div>
      </div>
      <div className="form-group">
        <input
          type="text" placeholder="First Name"
          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
          { ...register('firstName') }
        />
        <div className="invalid-feedback">{errors.firstName?.message}</div>
      </div>
      <div className="form-group">
        <input
          type="text" placeholder="Last Name"
          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
          { ...register('lastName') }
        />
        <div className="invalid-feedback">{errors.lastName?.message}</div>
      </div>
      <div className="form-group">
        <input
          type="email" placeholder="Email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          { ...register('email') }
        />
        <div className="invalid-feedback">{errors.email?.message}</div>
      </div>
      <div className="form-group">
        <input
          type="text" placeholder="Course"
          className={`form-control ${errors.course ? 'is-invalid' : ''}`}
          { ...register('course') }
        />
        <div className="invalid-feedback">{errors.course?.message}</div>
      </div>
      <div className="form-group">
        <select
          className={`form-control ${errors.courseType ? 'is-invalid' : ''}`}
          { ...register('courseType') }
        >
          <option>CUTEP</option>
          <option>TOEIC</option>
          <option>IELTS</option>
        </select>
        <div className="invalid-feedback">{errors.courseType?.message}</div>
      </div>
      <div className="form-group">
        <input
          type="date" placeholder="Start Date"
          className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
          { ...register('startDate') }
        />
        <div className="invalid-feedback">{errors.startDate?.message}</div>
      </div>
      <div className="form-group">
        <input
          type="date" placeholder="End Date"
          className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
          { ...register('endDate') }
        />
        <div className="invalid-feedback">{errors.endDate?.message}</div>
      </div>
      <div className="text-right">
        <button type="submit" className="btn btn-primary pill w-100" disabled={formState.isSubmitting}>
          {formState.isSubmitting && <div className="spinner-border spinner-border-sm mr-1"/>}
          Submit
        </button>
      </div>
    </form>
  )
}
