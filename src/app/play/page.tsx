'use client'

import CreateGame from "@/components/CreateGame"
import PlayGame from "@/components/PlayGame"
import NavBar from "@/components/NavBar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ContractProvider from "@/hooks/contract"
import { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "@/redux/wallet/walletSlice"

export default function Page() {

    const address = useSelector((state: RootState) => state.wallet.address);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (address === "") {
            router.push("/")
        }
    }, [address])

    return (
        <ContractProvider>
            <NavBar address={address} logout={() => dispatch(logout())} />
            <div className="flex justify-center items-center mt-20">
                <Tabs defaultValue="createGame" className=" min-w-fit w-[430px] md:w-1/2 ">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="createGame">Create Game</TabsTrigger>
                        <TabsTrigger value="playGame">Play Game</TabsTrigger>
                    </TabsList>
                    <TabsContent value="createGame" className="border-2 rounded-md p-5">
                        <CreateGame />
                    </TabsContent>
                    <TabsContent value="playGame" className="border-2 rounded-md p-5">
                        <PlayGame />
                    </TabsContent>
                </Tabs>
            </div>
        </ContractProvider>
    )
}