import { useEffect, useState } from 'react'
import ReactCardFlip from 'react-card-flip'
import { useFlashCard } from 'hooks'
import { userService } from 'services'
import Image from 'next/image'

export default function Main() {
  const [isStarted, setIsStarted] = useState(false)
  const [isFliped, setIsFliped] = useState(false)
  const { words, word, currentIndex, handleNext, finished, nomore, stat } = useFlashCard()
  const isWebSpeech = 'speechSynthesis' in window
  const [sessionEnded, setSessionEnded] = useState(false)

  useEffect(() => {
    if (userService.userValue.showHowto)
      $('#modal-form').modal({backdrop: 'static', keyboard: false}).modal('show')
  }, [])

  function handleSettingSubmit(evt) {
    evt.preventDefault()
    const data = new FormData(evt.target)
    userService.update(userService.userValue._id, { numPerDay: data.get('numPerDay') })
      .then(() => {
        setIsStarted(true)
      })
  }

  async function handleCloseClick() {
    $('#modal-form').modal('hide')
    await userService.update(userService.userValue._id, { showHowto: false })
  }

  async function handlePlayClick() {
    await handleCloseClick()
    $('#modal-video').modal('show')
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

  if (!userService.userValue.numPerDay) {
    return (
      <>
      <div className="card card-num-days mx-auto">
        <div className="card-header">
          <h5 className="modal-title text-center text-primary">
            How many <span className="text-danger">words</span> per day do you want to memorize?<br/>
            <small style={{color:'gray', fontSize:'0.95rem'}}>กรุณาระบุจำนวนคำศัพท์ที่ต้องการท่องต่อวัน (ไม่สามารถเปลี่ยนได้)</small>
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSettingSubmit}>
            <div className="form-group">
              <input type="number" placeholder="New words / day" name="numPerDay" className="form-control"/>
            </div>
            <button className="btn btn-primary w-100">Start</button>
          </form>
        </div>
      </div>

      <div className="text-center pt-4">
        <Image src="/state-setnums.png" width="600" height="421"/>
      </div>

      <div id="modal-form" className="modal modal-howto">
        <div className="modal-dialog">
          <div className="modal-content bg-danger">
            <div className="modal-body">
              <button type="button" className="close" onClick={handleCloseClick}>
                <span>&times;</span>
              </button>
              <p className="text-white">
                สำหรับการใช้งานครั้งแรก<br/>กดรับชมวิธีการใช้งานที่นี่ครับ&nbsp;
                <i className="bi bi-play-circle-fill" onClick={handlePlayClick}></i>
              </p>
            </div>
          </div>
        </div>
      </div>
      </>
    )
  }

  if (userService.userValue.numPerDay && !isStarted) {
    return (
      <div className="text-center">
        <h1>Welcome Back!</h1>
        <div className="d-flex my-4 text-lobby">
          <p className="flex-fill align-self-center">
            New <span className="text-danger">words</span> are waiting for you.<br/><br/>
            <button className="btn btn-sm btn-primary-gradient mt-2" onClick={() => setIsStarted(true)}>Ready</button>
          </p>
        </div>

        <div className="text-center">
          <Image src="/state-login.png" width="737" height="400"/>
        </div>
      </div>
    )
  }

  if (sessionEnded)
    return (
      <div className="text-center">
        <h2>Well Done!</h2>
        <p>See you tomorrow.<br/>Keep Working and Achieve your Goal Together.</p>
        <div><button className="btn btn-primary-gradient mt-2" onClick={userService.logout}>END</button></div>
        <Image src="/state-finished.png" width="810" height="540"/>
      </div>
    )

  if (finished)
    return (
      <div className="d-flex justify-content-center">
        <div className="mx-2"><Image src="/state-howto.png" width="220" height="475"/></div>
        <div className="mx-2 ipad">
          <h4 className="mb-2">Until today</h4>
          <p>You firmly memorized <span className="text-danger">{stat.completed}</span> words.</p>
          <p>You still have <span className="text-danger">{stat.totalWords}</span> words to fight for.</p>
          <button className="btn btn-primary-gradient mt-2" onClick={() => setSessionEnded(true)}>NEXT</button>
        </div>
      </div>
    )

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
                <h4>{word.word}</h4>
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
              <h4>
                {word.word}
                {isWebSpeech &&
                  <div className="d-inline ml-2">
                    <button className="btn btn-xs btn-icon btn-circle btn-secondary" onClick={handleSpeechClick(word.word)}>
                      <i className="bi bi-volume-up-fill"></i>
                    </button>
                  </div>
                }
              </h4>
              <div className="text-primary">{word.pos}</div>
            </div>
            <div className="card-body text-center">
              <p>{word.translation}</p>
              <div className="font-weight-bold text-black">Synonym</div>
              <p>{word.synonym}</p>
            </div>
          </div>
        </ReactCardFlip>

        <p className={`text-center mt-4 ${isFliped && 'hidden'}`}>Tab the card to see the answer.</p>

        {isFliped &&
          <div className="row row-btn mt-4">
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
    </>
  )
}