import { useEffect, useState } from 'react'
import ReactCardFlip from 'react-card-flip'
import { useFlashCard } from 'hooks'
import { userService } from 'services'
import moment from 'moment/moment'

export default function Main() {
  const [isFliped, setIsFliped] = useState(false)
  const { words, word, currentIndex, handleNext, finished } = useFlashCard()

  useEffect(() => {
    if (userService.userValue.numPerDay)
      return
    $('#modal-form').modal({backdrop: 'static', keyboard: false}).modal('show')
  }, [])

  function handleSettingSubmit(evt) {
    evt.preventDefault()
    const data = new FormData(evt.target)
    userService.update(userService.userValue._id, { numPerDay: data.get('numPerDay') })
      .then(() => {
        $('#modal-form').modal('hide')
      })
  }

  function handleButtonClick(date) {
    return async (evt) => {
      setIsFliped(false)
      await handleNext(date)
    }
  }

  if (finished)
    return <h3>See you tomorrow.</h3>

  return (
    <>
    {word ?
      <>
        <div className="text-right mb-4">{`${currentIndex}/${words.length}`}</div>

        <ReactCardFlip isFlipped={isFliped} flipSpeedFrontToBack={1} flipDirection="horizontal">
          <div className="card" onClick={() => setIsFliped(true)}>
            <div className="card-body d-flex align-items-center">
              <h5 className="text-center flex-fill">{`${word.word} (${word.pos})`}</h5>
            </div>
          </div>

          <div className="card">
            <div className="card-header"><h5 className="text-center">{`${word.word} (${word.pos})`}</h5></div>
            <div className="card-body">
              <p className="text-center">{word.translation}</p>
            </div>
          </div>
        </ReactCardFlip>

        <p className={`text-center mt-4 ${isFliped && 'invisible'}`}>Click to see answer.</p>

        {isFliped &&
          <div className="row row-btn">
            <div className="col-12 col-sm px-sm-1">
              <button
                className="btn btn-block btn-outline-success pill mb-3"
                onClick={handleButtonClick('clear')}
              >Very Easy<br/><small>(Clear)</small></button>
            </div>
            <div className="col-12 col-sm px-sm-1">
              <button
                className="btn btn-block btn-outline-primary pill mb-3"
                onClick={handleButtonClick(moment().add(7, 'd'))}
              >Easy<br/><small>(7 days)</small></button>
            </div>
            <div className="col-12 col-sm px-sm-1">
              <button
                className="btn btn-block btn-outline-secondary pill mb-3"
                onClick={handleButtonClick(moment().add(3, 'd'))}
              >Medium<br/><small>(3 days)</small></button>
            </div>
            <div className="col-12 col-sm px-sm-1">
              <button
                className="btn btn-block btn-outline-warning pill mb-3"
                onClick={handleButtonClick(moment().add(1, 'd'))}
              >Difficult<br/><small>(Tomorrow)</small></button>
            </div>
            <div className="col-12 col-sm px-sm-1">
              <button
                className="btn btn-block btn-outline-danger pill mb-3"
                onClick={handleButtonClick('again')}
              >Very Difficult<br/><small>(Again)</small></button>
            </div>
          </div>
        }
      </>
      :
      <div className="text-center"><div className="spinner-border"/></div>
    }

    <div id="modal-form" className="modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Please choose your preference</h5>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSettingSubmit}>
                <div className="form-group">
                  <input type="number" placeholder="New words / day" name="numPerDay" className="form-control"/>
                </div>
                <button className="btn btn-primary w-100">Start</button>
              </form>
            </div>
          </div>
        </div>
    </div>
    </>
  )
}