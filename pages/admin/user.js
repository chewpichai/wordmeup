import axios from 'axios'
import moment from 'moment/moment'
import { useEffect, useMemo, useState } from 'react'
import { UserForm } from 'components'
import debounce from 'lodash.debounce'

const INIT_USER = {
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  email: '',
  course: '',
  courseType: 'CUTEP',
  startDate: '',
  endDate: '',
}

export default function User() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(INIT_USER)
  const [searchTxt, setSearchTxt] = useState('')

  useEffect(() => {
    axios.get('/api/user')
      .then(response => {
        setUsers(response.data)
        setLoading(false)
      })
  }, [])

  function handleAddClick() {
    setEditingUser(INIT_USER)
    $('#modal-form').modal('show')
  }

  function handleSave(user) {
    setUsers(prev => {
      const i = prev.findIndex(u => u._id === user._id)
      if (i === -1)
        prev.push(user)
      else
        prev.splice(i, 1, user)
      return [...prev]
    })
    $('#modal-form').modal('hide')
  }

  function handleEditClick(user) {
    return () => {
      setEditingUser(user)
      $('#modal-form').modal('show')
    }
  }

  function handleDeleteClick(user) {
    return () => {
      axios.delete(`/api/user/${user._id}`)
        .then(() => {
          setUsers(prev => {
            const i = prev.findIndex(u => u._id === user._id)
            if (i !== -1)
              prev.splice(i, 1)
            return [...prev]
          })
        })
    }
  }

  const handleSearchChange = useMemo(
    () => debounce((evt => {
      setSearchTxt(evt.target.value)
    }), 500)
  , [])

  if (loading)
    return <div className="text-center"><div className="spinner-border"/></div>

  return (
    <>
    <div className="d-flex align-items-center mb-4">
      <button className="btn btn-icon btn-circle btn-outline-primary" onClick={handleAddClick}><i className="bi bi-plus-lg"></i></button>
      <div className="ml-auto col-xs-12">
        <input className="form-control" type="text" placeholder="Search" autoComplete="off" onChange={handleSearchChange} />
      </div>
    </div>

    <div className="table-overflow">
      <table className="table">
        <thead className="thead-light">
          <tr className="text-center">
            <th scope="col">#</th>
            <th scope="col">Username</th>
            <th scope="col">Password</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Email</th>
            <th scope="col">Course</th>
            <th scope="col">Course Type</th>
            <th scope="col">Start</th>
            <th scope="col">End</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
        {users.filter(u => Object.values(u).some(v => v.toString().includes(searchTxt))).map((u, i) =>
          <tr key={i}>
            <th scope="row">{i + 1}</th>
            <td>{u.username}</td>
            <td>{u.password}</td>
            <td>{u.firstName}</td>
            <td>{u.lastName}</td>
            <td>{u.email}</td>
            <td>{u.course}</td>
            <td>{u.courseType}</td>
            <td>{moment(u.startDate).format('DD/MM/YY')}</td>
            <td>{moment(u.endDate).format('DD/MM/YY')}</td>
            <td>
              <button className="btn btn-xs btn-icon btn-circle btn-outline-warning m-1" onClick={handleEditClick(u)}>
                <i className="bi bi-pencil-square"></i>
              </button>
              <button className="btn btn-xs btn-icon btn-circle btn-outline-danger m-1" onClick={handleDeleteClick(u)}>
                <i className="bi bi-trash-fill"></i>
              </button>
            </td>
          </tr>
        )}
        </tbody>
      </table>
    </div>

    <div id="modal-form" className="modal">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal">
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <UserForm user={editingUser} onSave={handleSave} />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}