'use client'

import CreateGame from "@/components/CreateGame"
import PlayGame from "@/components/PlayGame"
import ContractProvider from "@/hooks/contract"
import store, { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Provider, useSelector } from "react-redux"

export default function Page() {

    const [contractAddress, setContractAddress] = useState<string>("");
    const [page, setPage] = useState<string | null>(null);
    const address = useSelector((state: RootState) => state.wallet.address);
    const router = useRouter()

    const closePage = () => {
        setPage(null)
    }

    useEffect(() => {
        if (address === "") {
            router.push("/")
        }
    }, [address])

    return (
        <ContractProvider>
            <div>
                <div>
                    <div>
                        <input value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} />
                        <button onClick={() => setPage("playGame")}>Open game</button>
                    </div>
                    <p>OR</p>
                    <button onClick={() => setPage("createGame")}>Create Game</button>
                </div>
                <div>
                    {page === "createGame" && <CreateGame />}
                    {page === "playGame" && <PlayGame contractAddress={contractAddress} />}
                </div>
            </div>
        </ContractProvider>
    )
}