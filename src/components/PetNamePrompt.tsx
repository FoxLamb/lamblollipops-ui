import { useState, useCallback } from 'react'

interface PetNamePromptProps {
  onSubmit: (name: string) => void
}

export default function PetNamePrompt({ onSubmit }: PetNamePromptProps) {
  const [name, setName] = useState('')

  const handleSubmit = useCallback(() => {
    const trimmed = name.trim()
    if (trimmed.length > 0) {
      onSubmit(trimmed)
    }
  }, [name, onSubmit])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }, [handleSubmit])

  return (
    <div className="pet-name-prompt">
      <label className="pet-name-label" htmlFor="lamb-name">
        Name your lamb:
      </label>
      <div className="pet-name-input-row">
        <input
          id="lamb-name"
          className="pet-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={20}
          autoFocus
          placeholder="..."
        />
        <button
          className="pet-name-btn"
          onClick={handleSubmit}
          disabled={name.trim().length === 0}
        >
          OK
        </button>
      </div>
    </div>
  )
}
