import { useState, useCallback } from 'react'

export function useUndo<T>(initialPresent: T) {
  const [history, setHistory] = useState<T[]>([initialPresent])
  const [currentIndex, setCurrentIndex] = useState(0)

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  const undo = (updateState: (state: T) => void) => {
    if (canUndo) {
      updateState(history[currentIndex - 1])
      setCurrentIndex(currentIndex - 1)
    }
  }

  const redo = (updateState: (state: T) => void) => {
    if (canRedo) {
      updateState(history[currentIndex + 1])
      setCurrentIndex(currentIndex + 1)
    }
  }

  const addToHistory = useCallback((state: T) => {
    setHistory(prev => [...prev.slice(0, currentIndex + 1), state])
    setCurrentIndex(prev => prev + 1)
  }, [currentIndex])

  return {
    state: history[currentIndex],
    canUndo,
    canRedo,
    undo,
    redo,
    addToHistory,
  }
}

