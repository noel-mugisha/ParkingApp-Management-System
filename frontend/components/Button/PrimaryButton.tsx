"use client"
import React, { FC } from 'react'
import { ClipLoader } from 'react-spinners';

interface buttonProps {
  containerStyles?: string;
  textStyles?: string;
  handlePress?: () => void;
  title: string;
  loading?: Boolean;
  buttonType?: "submit" | "reset" | "button";
}

const PrimaryButton: FC<buttonProps> = ({ containerStyles, textStyles, handlePress, title, loading, buttonType }) => {
  return (
    <button type={buttonType} onClick={handlePress} className={`bg-primary text-center flex items-center justify-center py-4 rounded-xl ${containerStyles}`}>
      {
        loading ? (
          <ClipLoader 
            color='#ffffff'
            size={21}
          />
        ) : (
          <p className={`text-white text-[15px] text-center ${textStyles}`}>{title}</p>
        )
      }
    </button>
  )
}

export default PrimaryButton