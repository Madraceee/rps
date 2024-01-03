'use client'
import { useState } from "react";
import MoveBtn from "./MoveBtn";
import { BigNumber } from "ethers";
import { Move, useContract } from "@/hooks/contract";
import { useToast } from "./ui/use-toast";

const CreateGame = () => {
    const [opponentAddress, setOpponentAddress] = useState<string>("");
    const [stake, setStake] = useState<string>("");
    const [salt, setSalt] = useState<string>("0")
    const [move, setMove] = useState<Move>(Move.Null);
    const [contractAddress, setContractAddress] = useState<string>("")
    const { createGame } = useContract();
    const { toast } = useToast()

    const startGame = async () => {
        const convertedSalt = parseInt(salt)

        try {
            const address = await createGame(opponentAddress, move, convertedSalt, stake)
            setContractAddress(address)
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

        }

    }

    return (
        <div>
            <input value={opponentAddress} onChange={(e) => setOpponentAddress(e.target.value)} />
            <input value={stake} onChange={(e) => setStake(e.target.value)} />
            <input value={salt} onChange={(e) => setSalt(e.target.value)} />
            <MoveBtn text="Rock" onClick={() => setMove(Move.Rock)} />
            <MoveBtn text="Paper" onClick={() => setMove(Move.Paper)} />
            <MoveBtn text="Scissors" onClick={() => setMove(Move.Scissors)} />
            <MoveBtn text="Spock" onClick={() => setMove(Move.Spock)} />
            <MoveBtn text="Lizard" onClick={() => setMove(Move.Lizard)} />
            <button onClick={startGame}>Create Game</button>
            {contractAddress !== "" ? <p>Contract Address : {contractAddress}</p> : null}
        </div>
    );
}

export default CreateGame