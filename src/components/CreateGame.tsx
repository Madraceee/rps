'use client'
import { useState } from "react";
import MoveBtn from "./MoveBtn";
import { BigNumber } from "ethers";
import { Move, useContract } from "@/hooks/contract";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";

const CreateGame = () => {
    const [opponentAddress, setOpponentAddress] = useState<string>("");
    const [stake, setStake] = useState<string>("");
    const [salt, setSalt] = useState<string>("")
    const [move, setMove] = useState<Move>(Move.Null);
    const [contractAddress, setContractAddress] = useState<string>("")
    const { createGame } = useContract();
    const { toast } = useToast();
    const [loading, setLoading] = useState<boolean>(false)

    const startGame = async () => {
        const convertedSalt = parseInt(salt)

        try {
            setLoading(true);
            const address = await createGame(opponentAddress, move, convertedSalt, stake);
            setContractAddress(address);
            setLoading(false);
        } catch (error) {
            console.log(error)
            if (error === "Hasher Contract Not found") {
                toast({
                    description: "Check connection to network"
                })
            } else {
                toast({
                    title: "Creation Error",
                    description: "Could not create contract",
                    variant: "destructive"
                })
            }
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col w-full gap-3">
            <Input value={opponentAddress} onChange={(e) => setOpponentAddress(e.target.value)} placeholder="Opp. Address" />
            <Input value={stake} onChange={(e) => setStake(e.target.value)} placeholder="Stake in gwei" />
            <Input value={salt} onChange={(e) => setSalt(e.target.value)} placeholder="Salt" />
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
                <p className="text-center">
                    Contract Address : <span className="font-bold">{contractAddress}</span>
                </p> : null}
        </div>
    );
}

export default CreateGame