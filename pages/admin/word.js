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
    <div className="mb-4">
      <button className="btn btn-primary w-25" onClick={handleAddClick}>Add</button>
    </div>

    <div className="table-responsive">
      <table className="table">
        <thead>
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
        {words.map((w, i) =>
          <tr key={i}>
            <th scope="row">{i + 1}</th>
            <td>{w.word}</td>
            <td>{w.pos}</td>
            <td>{w.translation}</td>
            <td>{w.synonym}</td>
            <td>{w.types.map((t, i) => <div key={i}><small>{t}</small></div> )}</td>
            <td>
              <button className="btn btn-sm btn-warning text-white" onClick={handleEditClick(w)}>
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