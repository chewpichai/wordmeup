import { useEffect, useState } from 'react'
import ReactCardFlip from 'react-card-flip'
import { useFlashCard } from 'hooks'
import { userService } from 'services'
import moment from 'moment/moment'
import Image from 'next/image'

export default function Main() {
  const [isFliped, setIsFliped] = useState(false)
  const { words, word, currentIndex, handleNext, finished, nomore } = useFlashCard()
  const isWebSpeech = 'speechSynthesis' in window

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

  function handleSpeechClick(word) {
    return (evt) => {
      evt.stopPropagation()
      if (!isWebSpeech)
        return
      const voice = window.speechSynthesis.getVoices().find(v => v.lang === 'en-GB')
      const utter = new SpeechSynthesisUtterance(word)
      utter.voice = voice
      window.speechSynthesis.speak(utter)
    }
  }

  if (finished) {
    return (
      <div className="text-center">
        <h2>Well Done!</h2>
        <p>See you tomorrow.<br/>Keep Working and Achieve your Goal Together.</p>
        <Image src="/state-finished.png" width="1140" height="760"/>
      </div>
    )
  }

  if (nomore)
    return <h3>No more words to learn.</h3>

  return (
    <>
    {word ?
      <>
        <div className="text-right mb-4">{`${currentIndex + 1}/${words.length}`}</div>

        <ReactCardFlip isFlipped={isFliped} flipSpeedFrontToBack={1} flipDirection="horizontal">
          <div className="card" onClick={() => setIsFliped(true)}>
            <div className="card-body d-flex align-items-center">
              <div className="flex-fill text-center">
                <h5>{word.word}</h5>
                {isWebSpeech &&
                  <div>
                    <button className="btn btn-xs btn-icon btn-circle btn-secondary" onClick={handleSpeechClick(word.word)}>
                      <i className="bi bi-volume-up-fill"></i>
                    </button>
                  </div>
                }
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header text-center">
              <h5>{word.word}</h5>
              {isWebSpeech &&
                <div>
                  <button className="btn btn-xs btn-icon btn-circle btn-secondary" onClick={handleSpeechClick(word.word)}>
                    <i className="bi bi-volume-up-fill"></i>
                  </button>
                </div>
              }
            </div>
            <div className="card-body text-center">
              <div className="text-primary">{word.pos}</div>
              <p>{word.translation}</p>
              <div className="font-weight-bold font-italic">Synonym</div>
              <p>{word.synonym}</p>
            </div>
          </div>
        </ReactCardFlip>

        <p className={`text-center mt-4 ${isFliped && 'invisible'}`}>Tab the card to see the answer.</p>

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
                onClick={handleButtonClick(7)}
              >Easy<br/><small>(7 days)</small></button>
            </div>
            <div className="col-12 col-sm px-sm-1">
              <button
                className="btn btn-block btn-outline-secondary pill mb-3"
                onClick={handleButtonClick(3)}
              >Medium<br/><small>(3 days)</small></button>
            </div>
            <div className="col-12 col-sm px-sm-1">
              <button
                className="btn btn-block btn-outline-warning pill mb-3"
                onClick={handleButtonClick(1)}
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