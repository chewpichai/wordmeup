import axios from 'axios'
import { useEffect, useState } from 'react'
import { userService } from 'services'

export default function Completed() {
  const [loading, setLoading] = useState(true)
  const [words, setWords] = useState([])

  useEffect(() => {
    const uid = userService.userValue._id
    const params = { status: 'completed' }
    axios.get(`/api/user/${uid}/word`, { params })
      .then((response) => {
        setWords(response.data)
        setLoading(false)
      })
  }, [])

  if (loading)
    return <div className="text-center"><div className="spinner-border"/></div>

  return (
    <div className="table-overflow">
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Word</th>
            <th scope="col">POS</th>
            <th scope="col">Translation</th>
            <th scope="col">Synonym</th>
          </tr>
        </thead>
        <tbody>
        {words.map((w, i) =>
          <tr key={i}>
            <th scope="row">{i + 1}</th>
            <td>{w.word}</td>
            <td>{w.pos}</td>
            <td>{w.translation}</td>
            <td>{w.synonym}</td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  )
}
