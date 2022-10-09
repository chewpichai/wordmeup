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

  if (!word)
    return <div className="text-center"><div className="spinner-border"/></div>

  if (finished)
    return <h3>See you tomorrow.</h3>

  return (
    <>
    <div className="text-right">{`${currentIndex}/${words.length}`}</div>

    <ReactCardFlip isFlipped={isFliped} flipSpeedFrontToBack={1} flipDirection="horizontal">
      <div className="card-flip" role="button" onClick={() => setIsFliped(true)}>
        <div className="flex-fill text-center">
          <h5>{`${word.word} (${word.pos})`}</h5>
        </div>
      </div>

      <div className="card-flip">
        <div className="flex-fill text-center">
          <h5>{`${word.word} (${word.pos})`}</h5>
          <p>{word.translation}</p>
        </div>
      </div>
    </ReactCardFlip>

    <p className={`text-center ${isFliped && 'invisible'}`}>Click to see answer.</p>

    {isFliped &&
      <div className="row row-btn">
        <div className="col-12 col-sm px-sm-1">
          <button
            className="btn btn-sm btn-block btn-success mb-2"
            onClick={handleButtonClick('clear')}
          >Very Easy<br/><small>(Clear)</small></button>
        </div>
        <div className="col-12 col-sm px-sm-1">
          <button
            className="btn btn-sm btn-block btn-primary mb-2"
            onClick={handleButtonClick(moment().add(7, 'd'))}
          >Easy<br/><small>(7 days)</small></button>
        </div>
        <div className="col-12 col-sm px-sm-1">
          <button
            className="btn btn-sm btn-block btn-neutral mb-2"
            onClick={handleButtonClick(moment().add(3, 'd'))}
          >Medium<br/><small>(3 days)</small></button>
        </div>
        <div className="col-12 col-sm px-sm-1">
          <button
            className="btn btn-sm btn-block btn-warning mb-2"
            onClick={handleButtonClick(moment().add(1, 'd'))}
          >Difficult<br/><small>(Tomorrow)</small></button>
        </div>
        <div className="col-12 col-sm px-sm-1">
          <button
            className="btn btn-sm btn-block btn-danger mb-2"
            onClick={handleButtonClick('again')}
          >Very Difficult<br/><small>(Again)</small></button>
        </div>
      </div>
    }

    <div id="modal-form" className="modal">
      <form onSubmit={handleSettingSubmit}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Please choose your preference</h5>
            </div>
            <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="numPerDay">New words / day</label>
                  <input type="number" id="numPerDay" name="numPerDay" className="form-control"/>
                </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary">Start</button>
            </div>
          </div>
        </div>
      </form>
    </div>
    </>
  )
}