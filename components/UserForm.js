import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import moment from 'moment'
import { useEffect, useRef, useState } from 'react'

// [v1.3] สุ่มรหัส 8 ตัว (ไม่มีตัวที่สับสนง่าย เช่น 0/O, 1/l)
function randomPassword() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789'
  const a = new Uint32Array(8)
  window.crypto.getRandomValues(a)
  return Array.from(a, (n) => chars[n % chars.length]).join('')
}

export function UserForm({ user, onSave }) {
  const isEdit = !!user._id
  const editRef = useRef(isEdit)
  editRef.current = isEdit // ฟอร์มเดียวใช้ทั้งเพิ่มและแก้ จึงอ่านค่าล่าสุดผ่าน ref
  const [saveErr, setSaveErr] = useState('')
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    // [v1.3] แก้ผู้ใช้: เว้นว่าง = ใช้รหัสเดิม · เพิ่มผู้ใช้ใหม่: ต้องใส่
    password: Yup.string()
      .test('need', 'Password is required.', (v) => editRef.current || !!(v && v.trim()))
      .test('len', 'รหัสผ่านต้องยาวอย่างน้อย 4 ตัว', (v) => !v || !v.trim() || v.trim().length >= 4),
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
      password: /^scrypt\$/.test(user.password || '') ? '' : (user.password || ''), // [v1.3.1] แสดงรหัสเดิมให้แอดมินเห็น/แก้ได้
      startDate: moment(user.startDate).format('YYYY-MM-DD'),
      endDate: moment(user.endDate).format('YYYY-MM-DD'),
    }),
    resolver: yupResolver(validationSchema)
  }
  const { register, handleSubmit, formState, reset, setValue } = useForm(formOptions)
  const { errors } = formState

  useEffect(() => {
    reset(formOptions.defaultValues)
    setSaveErr('')
  }, [user])

  function onSubmit(data) {
    setSaveErr('')
    const body = { ...data }
    if (isEdit && !body.password) delete body.password
    const fail = (err) => setSaveErr(err.response?.data?.message || 'บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง')
    if (isEdit) {
      return axios.put(`/api/user/${user._id}`, body)
        .then(response => {
          onSave(response.data)
        }).catch(fail)
    } else {
      return axios.post('/api/user', body)
        .then(response => {
          onSave(response.data)
        }).catch(fail)
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
        <div className="input-group">
          <input
            type="text" autoComplete="off"
            placeholder={isEdit ? 'ตั้งรหัสใหม่' : 'Password'}
            aria-label="Password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            { ...register('password') }
          />
          <div className="input-group-append">
            <button className="btn btn-outline-secondary" type="button" onClick={() => setValue('password', randomPassword(), { shouldValidate: true })}>สุ่มรหัส</button>
          </div>
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>
        <small className="form-text" style={{ color: '#5E6170' }}>อย่างน้อย 4 ตัว · กด &quot;สุ่มรหัส&quot; ได้ถ้าไม่อยากคิดเอง</small>
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
      {saveErr && <div className="alert alert-danger" role="alert">{saveErr}</div>}
      <div className="text-right">
        <button type="submit" className="btn btn-primary pill w-100" disabled={formState.isSubmitting}>
          {formState.isSubmitting && <div className="spinner-border spinner-border-sm mr-1"/>}
          Submit
        </button>
      </div>
    </form>
  )
}
