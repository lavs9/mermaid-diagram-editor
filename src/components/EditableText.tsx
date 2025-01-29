import React, { useState } from 'react';

interface EditableTextProps {
  initialText: string;
  onTextChange: (newText: string) => void;
}

const EditableText: React.FC<EditableTextProps> = ({ initialText, onTextChange }) => {
    const [text, setText] = useState(initialText.replace(/<br>/g, '\n'));
  
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onTextChange(text);
      }
    };
  
    return (
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => onTextChange(text)}
        className="editable-text"
      />
    );
  };

export default EditableText; 