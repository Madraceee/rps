'use client'

import { AppDispatch, RootState } from "@/redux/store"
import { getNewProvider, getNewSigner } from "@/redux/wallet/walletSlice"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "./ui/button"
import { Download, Wallet2 } from "lucide-react"
const Login = () => {

    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const error = useSelector((state: RootState) => state.wallet.error);
    const address = useSelector((state: RootState) => state.wallet.address);

    const [isProviderPresent, setIsProviderPresent] = useState<boolean>(false)

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

    useEffect(() => {
        if (window.ethereum && window.ethereum.isMetaMask === true) {
            setIsProviderPresent(true)
        }
    }, [])

    return (
        <div className="w-full min-h-screen flex flex-col justify-center items-center gap-5">
            <p className="text-2xl md:text-4xl text-center">Start Playing with your friends today !!</p>
            <p className="text-2xl md:text-4xl text-center">Ultimate RPS game</p>
            {isProviderPresent ?
                <Button onClick={login}>
                    <Wallet2 className="mr-2 h-4 w-4" /> Login
                </Button>
                :
                <Button onClick={() => router.push("https://metamask.io/")}>
                    <Download className="mr-2 h-4 w-4" />Download Wallet
                </Button>
            }

        </div>
    )
}

export default Login