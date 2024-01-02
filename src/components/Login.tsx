'use client'

import { AppDispatch, RootState } from "@/redux/store"
import { getNewProvider, getNewSigner } from "@/redux/wallet/walletSlice"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

const Login = () => {

    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const error = useSelector((state: RootState) => state.wallet.error);
    const address = useSelector((state: RootState) => state.wallet.address);

    const login = async () => {
        await dispatch(getNewProvider());
        if (error) {
            console.log(error);
            return
        }

        await dispatch(getNewSigner())
        if (error) {
            console.log(error);
            return
        }
    }

    useEffect(() => {
        if (address !== "") {
            router.push("/play")
        }
    }, [address])
    return (
        <div>
            <button onClick={login}>Login</button>
        </div>
    )
}

export default Login