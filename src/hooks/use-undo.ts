import { useState, useCallback } from 'react'

export function useUndo<T>(initialState: T) {
  const [history, setHistory] = useState<T[]>([initialState])
  const [currentIndex, setCurrentIndex] = useState(0)

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex(currentIndex - 1)
    }
  }, [canUndo, currentIndex])

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex(currentIndex + 1)
    }
  }, [canRedo, currentIndex])

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

