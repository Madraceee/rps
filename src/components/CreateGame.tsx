'use client'
import { useState } from "react";
import MoveBtn from "./MoveBtn";
import { BigNumber } from "ethers";
import { Move, useContract } from "@/hooks/contract";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";
import CopyToClipBoard from "./CopyToClipboard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { shortenAddress } from "@/lib/utils";
import Link from "next/link";

const CreateGame = () => {
    const [opponentAddress, setOpponentAddress] = useState<string>("");
    const [stake, setStake] = useState<string>("");
    const [salt, setSalt] = useState<string>("");
    const [move, setMove] = useState<Move>(Move.Null);
    const [contractAddress, setContractAddress] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [valueType, setValueType] = useState<string>("ether")
    const { createGame, isValidAddress } = useContract();
    const { toast } = useToast();

    // Check for input types then create a new RPS contract
    const startGame = async () => {
        if (isNaN(parseInt(salt))) {
            toast({
                description: "Enter valid salt(Numerics)",
                variant: "destructive"
            })
            setSalt("")
            return;
        }

        if (!isValidAddress(opponentAddress)) {
            toast({
                description: "Enter valid Address",
                variant: "destructive"
            })
            setOpponentAddress("")
            return;
        }

        if (move === Move.Null) {
            toast({
                description: "Select move",
                variant: "destructive"
            });
            return;
        }

        const convertedSalt = parseInt(salt)

        try {
            setLoading(true);
            const address = await createGame(opponentAddress, move, convertedSalt, stake, valueType);
            setContractAddress(address);
            setLoading(false);

            setOpponentAddress("")
            setSalt("")
            setMove(Move.Null)
            setStake("")
        } catch (error: any) {
            if (error.message === "Hasher Contract Not found") {
                toast({
                    description: "Check connection to network"
                })
            } else {
                toast({
                    title: "Creation Error",
                    description: error.message,
                    variant: "destructive"
                })
            }
            setLoading(false);
            setOpponentAddress("")
            setSalt("")
            setMove(Move.Null)
            setStake("")
        }
    }


    const generateSalt = () => {
        const value = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
        setSalt(value.toString());
        window.navigator.clipboard.writeText(value.toString())
        toast({
            description: "Salt Copied to clipboard"
        })
    }

    return (
        <div className="flex flex-col w-full gap-3">
            <div className="text-muted-foreground">
                <p className="text-2xl font-bold text-primary">Create a game</p>
                <p>Enter your opponent address, move, and salt</p>
                <p>Rules are : <Link href={"https://bigbangtheory.fandom.com/wiki/Rock,_Paper,_Scissors,_Lizard,_Spock"} className="text-white underline">Link</Link></p>
                <p><span className="font-bold ">Note:</span> Remember your salt and move</p>
            </div>
            <Input value={opponentAddress} onChange={(e) => setOpponentAddress(e.target.value)} placeholder="Opp. Address" />
            <div className="flex flex-row gap-2">
                <Input value={stake} onChange={(e) => setStake(e.target.value)} placeholder="Stake" className="w-1/2 lg:w-3/4" />
                <Select onValueChange={(e) => setValueType(e)}>
                    <SelectTrigger className="w-1/2 lg:w-1/4">
                        <SelectValue placeholder="Ether" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem value="ether">Ether</SelectItem>
                        <SelectItem value="gwei">Gwei</SelectItem>
                        <SelectItem value="wei">Wei</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-row gap-2">
                <Input value={salt} onChange={(e) => setSalt(e.target.value)} placeholder="Salt" className="w-1/2 lg:w-3/4" />
                <Button onClick={generateSalt} className="w-1/2 lg:w-1/4">Generate Salt</Button>
            </div>

            <p className="font-bold mt-2">Select Move</p>
            <div className="flex flex-wrap flex-row gap-2 justify-around">
                <MoveBtn text="Rock" onClick={() => setMove(Move.Rock)} isSelected={move === 1} />
                <MoveBtn text="Paper" onClick={() => setMove(Move.Paper)} isSelected={move === 2} />
                <MoveBtn text="Scissors" onClick={() => setMove(Move.Scissors)} isSelected={move === 3} />
                <MoveBtn text="Spock" onClick={() => setMove(Move.Spock)} isSelected={move === 4} />
                <MoveBtn text="Lizard" onClick={() => setMove(Move.Lizard)} isSelected={move === 5} />
            </div>
            <Button onClick={startGame} className="w-fit mx-auto" disabled={loading}>
                {loading ?
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading
                    </> :
                    <>Create Game</>
                }

            </Button>
            {contractAddress !== "" ?
                <p className="text-center w-full">
                    Contract Address : <span className="font-bold">{shortenAddress(contractAddress)} <CopyToClipBoard content={contractAddress} /></span>
                </p> : null}
        </div>
    );
}

export default CreateGame