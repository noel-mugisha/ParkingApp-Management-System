"use client"
import { useApp } from '@/contexts/app/app-context'
import React from 'react'

const page = () => {
  const {user} = useApp()
  console.log(user)
  return (
    <div>page</div>
  )
}

export default page