import axios from 'axios'
import moment from 'moment/moment'
import { useEffect, useState } from 'react'
import { UserForm } from 'components'

const INIT_USER = {
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  email: '',
  course: '',
  courseType: 'CUTEP',
  startDate: moment().format('YYYY-MM-DD'),
  endDate: moment().format('YYYY-MM-DD'),
}

export default function User() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingUser, setEditingUser] = useState(INIT_USER)

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

  if (loading)
    return <div className="text-center"><div className="spinner-border"/></div>

  return (
    <>
    <div className="mb-4">
      <button className="btn btn-primary pill" onClick={handleAddClick}>Add</button>
    </div>

    <div className="table-overflow">
      <table className="table table-xl">
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
        {users.map((u, i) =>
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
              <button className="btn btn-icon btn-circle btn-warning" onClick={handleEditClick(u)}>
                <i className="bi bi-pencil-square"></i>
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