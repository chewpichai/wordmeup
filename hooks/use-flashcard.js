import axios from 'axios'
import { useEffect, useState } from 'react'
import { userService } from 'services'

export function useFlashCard() {
  const [words, setWords] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const uid = userService.userValue._id;
    axios.get(`/api/user/${uid}/word`)
      .then((response) => setWords(response.data))
  }, [])

  async function updateUserWord(date) {
    const data = {
      next: null,
      completed: false,
    }
    if (date === 'again') {
      words.push(words[currentIndex])
      return
    }
    if (date === 'clear')
      data.completed = true
    else
      data.next = date
    const uid = userService.userValue._id
    const wid = words[currentIndex]._id
    await axios.put(`/api/user/${uid}/word/${wid}`, data)
  }

  async function handleNext(date) {
    if (currentIndex < words.length - 1) {
      await updateUserWord(date)
      setCurrentIndex(i => i + 1)
    } else {
      setFinished(true)
    }
  }

  return {
    words,
    word: words[currentIndex],
    currentIndex,
    handleNext,
    finished,
  }
} 