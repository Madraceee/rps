'use client'

import CreateGame from "@/components/CreateGame"
import PlayGame from "@/components/PlayGame"
import ContractProvider from "@/hooks/contract"
import store from "@/redux/store"
import { useState } from "react"
import { Provider } from "react-redux"

export default function Page() {

    const [contractAddress, setContractAddress] = useState<string>("");
    const [page, setPage] = useState<string | null>(null);

    const closePage = () => {
        setPage(null)
    }

    return (
        <Provider store={store}>
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
        </Provider>
    )
}