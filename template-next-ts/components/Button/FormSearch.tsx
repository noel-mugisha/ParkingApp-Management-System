import React, { ChangeEvent, FC } from 'react'

interface formSearchProps{
    value: string;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const FormSearch: FC<formSearchProps> = ({ value, handleChange }) => {
    return (
        <input
            type="text"
            placeholder="Search..."
            value={value}
            onChange={handleChange}
            className="rounded-md text-sm outline-none px-4 h-[48px] w-full max-w-2xl bg-subprimary"
        />
    )
}

export default FormSearch