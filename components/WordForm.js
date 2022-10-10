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
        <input
          type="text" placeholder="Word"
          className={`form-control ${errors.word ? 'is-invalid' : ''}`}
          { ...register('word') }
        />
        <div className="invalid-feedback">{errors.word?.message}</div>
      </div>
      <div className="form-group">
        <input
          type="text" placeholder="POS"
          className={`form-control ${errors.pos ? 'is-invalid' : ''}`}
          { ...register('pos') }
        />
        <div className="invalid-feedback">{errors.pos?.message}</div>
      </div>
      <div className="form-group">
        <textarea
          placeholder="Translation"
          className={`form-control ${errors.translation ? 'is-invalid' : ''}`}
          { ...register('translation') }
        />
        <div className="invalid-feedback">{errors.translation?.message}</div>
      </div>
      <div className="form-group">
        <textarea
          placeholder="Synonym"
          className={`form-control ${errors.synonym ? 'is-invalid' : ''}`}
          { ...register('synonym') }
        />
        <div className="invalid-feedback">{errors.synonym?.message}</div>
      </div>
      <div className="form-group">
        <select
          multiple placeholder="Types"
          className={`form-control ${errors.types ? 'is-invalid' : ''}`}
          { ...register('types') }
        >
          <option>CUTEP</option>
          <option>TOEIC</option>
          <option>IELTS</option>
        </select>
        <div className="invalid-feedback">{errors.types?.message}</div>
      </div>
      <button type="submit" className="btn btn-primary pill w-100" disabled={formState.isSubmitting}>
        {formState.isSubmitting && <div className="spinner-border spinner-border-sm mr-1"/>}
        Submit
      </button>
    </form>
  )
}
