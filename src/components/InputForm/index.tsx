import { UseFormRegister, RegisterOptions } from "react-hook-form"

interface InputFormProps {
  type: string,
  placeholder: string,
  name: string,
  register: UseFormRegister<any>
  error?: string,
  rules?: RegisterOptions
}

export function InputForm({ type, placeholder, name, register, error, rules }: InputFormProps) {
  return (
    <div className="relative w-full">
      <input
        className="w-full rounded-md h-11 px-2 outline-none text-bg_color"
        type={type}
        id={name}
        placeholder={placeholder}
        {...register(name, rules)}
      />
      {error && <p className="absolute top-13 left-0 text-red-600 text-sm">{error}</p>}
    </div>
  )
}