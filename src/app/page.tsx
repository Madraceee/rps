'use client'
import store from "@/redux/store"
import { Provider } from "react-redux"
import Login from "@/components/Login"

export default function Home() {
  return (
    <main className="">
      <Provider store={store}>
        <Login />
      </Provider>
    </main>
  )
}
