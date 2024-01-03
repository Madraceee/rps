'use client'

import CreateGame from "@/components/CreateGame"
import PlayGame from "@/components/PlayGame"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ContractProvider from "@/hooks/contract"
import store, { RootState } from "@/redux/store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

export default function Page() {

    const address = useSelector((state: RootState) => state.wallet.address);
    const router = useRouter();

    useEffect(() => {
        if (address === "") {
            router.push("/")
        }
    }, [address])

    return (
        <ContractProvider>
            <div className="flex justify-center items-center min-h-screen">
                <Tabs defaultValue="createGame" className="w-[400px] md:w-1/2 ">
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