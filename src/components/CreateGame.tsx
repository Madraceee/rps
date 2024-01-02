'use client'
import { useState } from "react";
import MoveBtn from "./MoveBtn";
import { BigNumber } from "ethers";
import { Move, useContract } from "@/hooks/contract";

const CreateGame = () => {
    const [opponentAddress, setOpponentAddress] = useState<string>("");
    const [stake, setStake] = useState<string>("");
    const [salt, setSalt] = useState<string>("0")
    const [move, setMove] = useState<Move>(Move.Null);
    const { createGame } = useContract();

    const startGame = async () => {
        const convertedSalt = parseInt(salt)
        const address = await createGame(opponentAddress, move, convertedSalt, stake)
        console.log(address)
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
        </div>
    );
}

export default CreateGame