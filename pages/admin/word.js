import axios from 'axios'
import { useEffect, useState } from 'react'
import { WordForm } from 'components'

const INIT_WORD = {
  word: '',
  pos: '',
  translation: '',
  synonym: '',
  types: [],
}

export default function Word() {
  const [words, setWords] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingWord, setEditingWord] = useState(INIT_WORD)
  const [wordType, setWordType] = useState('CUTEP')

  useEffect(() => {
    axios.get('/api/word')
      .then(response => {
        setWords(response.data)
        setLoading(false)
      })
  }, [])

  function handleAddClick() {
    setEditingWord(INIT_WORD)
    $('#modal-form').modal('show')
  }

  function handleEditClick(word) {
    return () => {
      setEditingWord(word)
      $('#modal-form').modal('show')
    }
  }

  function handleDeleteClick(word) {
    return () => {
      axios.delete(`/api/word/${word._id}`)
        .then(() => {
          setWords(prev => {
            const i = prev.findIndex(w => w._id === word._id)
            if (i !== -1)
              prev.splice(i, 1)
            return [...prev]
          })
        })
    }
  }

  function handleSave(word) {
    setWords(prev => {
      const i = prev.findIndex(w => w._id === word._id)
      if (i === -1)
        prev.push(word)
      else
        prev.splice(i, 1, word)
      return [...prev]
    })
    $('#modal-form').modal('hide')
  }

  if (loading)
    return <div className="text-center"><div className="spinner-border"/></div>

  return (
    <>
    <div className="d-flex align-items-center mb-4">
      <button className="btn btn-icon btn-circle btn-outline-primary" onClick={handleAddClick}><i className="bi bi-plus-lg"></i></button>
      <div className="ml-auto col-xs-12">
        <select class="custom-select" onChange={(evt) => setWordType(evt.target.value)}>
          <option>CUTEP</option>
          <option>TOEIC</option>
          <option>IELTS</option>
        </select>
      </div>
    </div>

    <div className="table-overflow">
      <table className="table">
        <thead className="thead-light">
          <tr className="text-center">
            <th scope="col">#</th>
            <th scope="col">Word</th>
            <th scope="col">POS</th>
            <th scope="col">Translation</th>
            <th scope="col">Synonym</th>
            <th scope="col">Types</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
        {words.filter((w) => w.types.includes(wordType)).map((w, i) =>
          <tr key={i}>
            <th scope="row">{i + 1}</th>
            <td>{w.word}</td>
            <td>{w.pos}</td>
            <td>{w.translation}</td>
            <td>{w.synonym}</td>
            <td>{w.types.map((t, i) => <div key={i}><small>{t}</small></div> )}</td>
            <td>
              <button className="btn btn-xs btn-icon btn-circle btn-outline-warning m-1" onClick={handleEditClick(w)}>
                <i className="bi bi-pencil-square"></i>
              </button>
              <button className="btn btn-xs btn-icon btn-circle btn-outline-danger m-1" onClick={handleDeleteClick(w)}>
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
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <WordForm word={editingWord} onSave={handleSave} />
          </div>
        </div>
      </div>
    </div>
    </>
  )
}