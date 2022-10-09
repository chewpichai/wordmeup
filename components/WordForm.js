import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import axios from 'axios'
import { useEffect } from 'react'

export function WordForm({ word, onSave }) {
  const validationSchema = Yup.object().shape({
    word: Yup.string().required('Word is required'),
    pos: Yup.string().required('POS is required.'),
    translation: Yup.string().required('Translation is required.'),
    types: Yup.array().min(1, 'Types is required.'),
  })
  const formOptions = {
    defaultValues: validationSchema.cast(word),
    resolver: yupResolver(validationSchema)
  }
  const { register, handleSubmit, formState, reset } = useForm(formOptions)
  const { errors } = formState

  useEffect(() => {
    reset(formOptions.defaultValues)
  }, [word])

  function onSubmit(data) {
    if (word._id) {
      axios.put(`/api/word/${word._id}`, data)
        .then(response => {
          onSave(response.data)
        })
    } else {
      axios.post('/api/word', data)
        .then(response => {
          onSave(response.data)
        })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="word">Word</label>
        <input
          type="text" id="word"
          className={`form-control ${errors.word ? 'is-invalid' : ''}`}
          { ...register('word') }
        />
      </div>
      <div className="form-group">
        <label htmlFor="pos">POS</label>
        <input
          type="text" id="pos"
          className={`form-control ${errors.pos ? 'is-invalid' : ''}`}
          { ...register('pos') }
        />
      </div>
      <div className="form-group">
        <label htmlFor="translation">Translation</label>
        <textarea
          id="translation"
          className={`form-control ${errors.translation ? 'is-invalid' : ''}`}
          { ...register('translation') }
        />
      </div>
      <div className="form-group">
        <label htmlFor="synonym">Synonym</label>
        <textarea
          id="synonym"
          className={`form-control ${errors.synonym ? 'is-invalid' : ''}`}
          { ...register('synonym') }
        />
      </div>
      <div className="form-group">
        <label htmlFor="type">Types</label>
        <select
          multiple id="type"
          className={`form-control ${errors.types ? 'is-invalid' : ''}`}
          { ...register('types') }
        >
          <option>CUTEP</option>
          <option>TOEIC</option>
          <option>IELTS</option>
        </select>
        <div className="invalid-feedback">{errors.types?.message}</div>
      </div>
      <button type="submit" className="btn btn-primary w-100">Submit</button>
    </form>
  )
}
