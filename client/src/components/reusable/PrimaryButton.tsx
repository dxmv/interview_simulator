import { FC } from 'react'

interface PrimaryButtonProps {
  onClick: () => void
  text: string
  disabled:boolean
}

export const PrimaryButton: FC<PrimaryButtonProps> = ({ onClick, text, disabled }) => {
  return <button disabled={disabled} onClick={onClick} className="bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed">{text}</button>
}
