'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

export interface UseVoiceReturn {
  isListening: boolean
  isSpeaking: boolean
  transcript: string
  interimTranscript: string
  startListening: () => void
  stopListening: () => void
  speak: (text: string, onEnd?: () => void) => void
  cancelSpeech: () => void
  isSupported: boolean
  isTTSEnabled: boolean
  setTTSEnabled: (v: boolean) => void
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySpeechRecognition = any

export function useVoice(): UseVoiceReturn {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [isTTSEnabled, setTTSEnabled] = useState(true)
  const recognitionRef = useRef<AnySpeechRecognition>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  const isSupported =
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis
    }
  }, [])

  const startListening = useCallback(() => {
    if (!isSupported) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const win = window as any
    const SpeechRecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition
    if (!SpeechRecognitionCtor) return

    const recognition = new SpeechRecognitionCtor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => {
      setIsListening(false)
      setInterimTranscript('')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let final = ''
      let interim = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += text
        } else {
          interim += text
        }
      }
      if (final) setTranscript((prev: string) => prev + final)
      setInterimTranscript(interim)
    }

    recognition.onerror = () => {
      setIsListening(false)
      setInterimTranscript('')
    }

    recognitionRef.current = recognition
    setTranscript('')
    setInterimTranscript('')
    recognition.start()
  }, [isSupported])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
    setInterimTranscript('')
  }, [])

  const speak = useCallback(
    (text: string, onEnd?: () => void) => {
      if (!synthRef.current || !isTTSEnabled) {
        onEnd?.()
        return
      }
      // Cancel any ongoing speech
      synthRef.current.cancel()

      // Strip markdown for cleaner TTS
      const plain = text
        .replace(/```[\s\S]*?```/g, '')
        .replace(/[*_`#>]/g, '')
        .replace(/\n+/g, ' ')
        .trim()

      const utterance = new SpeechSynthesisUtterance(plain)
      utterance.rate = 0.95
      utterance.pitch = 1.0
      utterance.volume = 1.0

      // Prefer a natural English voice
      const voices = synthRef.current.getVoices()
      const preferred =
        voices.find((v) => v.lang === 'en-US' && v.name.toLowerCase().includes('natural')) ||
        voices.find((v) => v.lang.startsWith('en'))
      if (preferred) utterance.voice = preferred

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => {
        setIsSpeaking(false)
        onEnd?.()
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
        onEnd?.()
      }

      synthRef.current.speak(utterance)
    },
    [isTTSEnabled]
  )

  const cancelSpeech = useCallback(() => {
    synthRef.current?.cancel()
    setIsSpeaking(false)
  }, [])

  return {
    isListening,
    isSpeaking,
    transcript,
    interimTranscript,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
    isSupported,
    isTTSEnabled,
    setTTSEnabled,
  }
}
