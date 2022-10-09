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
        <label htmlFor="username">Username</label>
        <input
          type="text" id="username"
          className={`form-control ${errors.username ? 'is-invalid' : ''}`}
          { ...register('username') }
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="text" id="password"
          className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          { ...register('password') }
        />
      </div>
      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input
          type="text" id="firstName"
          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
          { ...register('firstName') }
        />
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text" id="lastName"
          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
          { ...register('lastName') }
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email" id="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          { ...register('email') }
        />
      </div>
      <div className="form-group">
        <label htmlFor="course">Course</label>
        <input
          type="text" id="course"
          className={`form-control ${errors.course ? 'is-invalid' : ''}`}
          { ...register('course') }
        />
      </div>
      <div className="form-group">
        <label htmlFor="courseType">Course Type</label>
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
        <label htmlFor="startDate">Start Date</label>
        <input
          type="date" id="startDate"
          className={`form-control ${errors.startDate ? 'is-invalid' : ''}`}
          { ...register('startDate') }
        />
      </div>
      <div className="form-group">
        <label htmlFor="endDate">End Date</label>
        <input
          type="date" id="endDate"
          className={`form-control ${errors.endDate ? 'is-invalid' : ''}`}
          { ...register('endDate') }
        />
      </div>
      <div className="text-right">
        <button type="submit" className="btn btn-primary w-100">Submit</button>
      </div>
    </form>
  )
}
