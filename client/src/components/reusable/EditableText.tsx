import { useState } from 'react';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  multiline?: boolean;
}

/**
 * Editable text component
 * @param value the value of the text
 * @param onSave the function to call when the text is saved
 * @param className the class name of the text
 * @param multiline whether the text is multiline
 * @returns the editable text component
 */
const EditableText = ({ value, onSave, className = '', multiline = false }: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(value);

  const handleSave = () => {
    onSave(editedValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex gap-2 items-start">
        {multiline ? (
          <textarea
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className={`border rounded p-1 min-w-[200px] ${className}`}
            rows={3}
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            className={`border rounded p-1 min-w-[200px] ${className}`}
            autoFocus
          />
        )}
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-2 py-1 rounded text-sm"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-500 text-white px-2 py-1 rounded text-sm"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:bg-gray-100 rounded p-1 -m-1 ${className}`}
    >
      {value}
    </div>
  );
};

export default EditableText;