'use client'
import store from "@/redux/store"
import { Provider } from "react-redux"
import Login from "@/components/Login"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <main className="">
      <Login />
    </main>
  )
}
