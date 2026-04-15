'use client'

import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react'
import clsx from 'clsx'
import type { UseVoiceReturn } from '@/hooks/useVoice'

interface Props {
  voice: UseVoiceReturn
  onTranscriptCommit: (text: string) => void
  disabled?: boolean
}

export function VoiceControl({ voice, onTranscriptCommit, disabled }: Props) {
  const { isListening, isSupported, isTTSEnabled, setTTSEnabled, transcript, startListening, stopListening, cancelSpeech } = voice

  const handleToggleMic = () => {
    if (isListening) {
      stopListening()
      if (transcript.trim()) {
        onTranscriptCommit(transcript.trim())
      }
    } else {
      startListening()
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* TTS toggle */}
      <button
        onClick={() => {
          setTTSEnabled(!isTTSEnabled)
          if (isTTSEnabled) cancelSpeech()
        }}
        className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title={isTTSEnabled ? 'Mute AI voice' : 'Unmute AI voice'}
      >
        {isTTSEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>

      {/* Mic button */}
      {isSupported ? (
        <button
          onClick={handleToggleMic}
          disabled={disabled}
          className={clsx(
            'p-2 rounded-lg transition-all duration-200',
            isListening
              ? 'bg-red-500 text-white ring-4 ring-red-300 dark:ring-red-900 animate-pulse-slow'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
            disabled && 'opacity-40 cursor-not-allowed'
          )}
          title={isListening ? 'Stop recording (submits transcript)' : 'Start voice input'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>
      ) : (
        <button
          disabled
          className="p-2 rounded-lg text-gray-300 dark:text-gray-600 cursor-not-allowed"
          title="Voice not supported in this browser"
        >
          <Mic className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
