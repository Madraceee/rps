'use client'
import { useEffect, useState } from "react";
import MoveBtn from "./MoveBtn"
import { Move, useContract } from "@/hooks/contract";
import { BigNumber } from "ethers";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Loader from "./Loader";

type Props = {
    contractAddress: string
}

const PlayGame = ({ contractAddress }: Props) => {

    const [stake, setStake] = useState<BigNumber>();
    const [j1, setJ1] = useState<string>("");
    const [j2, setJ2] = useState<string>("");
    const [move, setMove] = useState<Move>(Move.Null);
    const [salt, setSalt] = useState<string>("0");
    const [loading, setLoading] = useState<boolean>(true)

    const { play, getContractInfo, solve } = useContract();
    const address = useSelector((state: RootState) => state.wallet.address);

    const playMove = async () => {
        await play(contractAddress, move)
    }

    const finalResult = async () => {
        await solve(contractAddress, move, BigNumber.from(salt));
    }


    useEffect(() => {
        console.log("Address", contractAddress)
        async function getInfo() {
            const contractInfo = await getContractInfo(contractAddress);
            setStake(contractInfo.stake)
            setJ1(contractInfo.j1)
            setJ2(contractInfo.j2)

            setLoading(false)
        }

        getInfo();
    }, [])



    return (
        <div>
            {loading ? <Loader /> :
                address !== j1 && address !== j2 ?
                    <p>You cannot play this match</p> :
                    <>
                        <div>
                            <p>Stake : {stake?.toString()}</p>
                            <p>Player 1 : {j1}</p>
                            <p>Player 2 : {j2}</p>
                        </div>
                        <MoveBtn text="Rock" onClick={() => setMove(Move.Rock)} />
                        <MoveBtn text="Paper" onClick={() => setMove(Move.Paper)} />
                        <MoveBtn text="Scissors" onClick={() => setMove(Move.Scissors)} />
                        <MoveBtn text="Spock" onClick={() => setMove(Move.Spock)} />
                        <MoveBtn text="Lizard" onClick={() => setMove(Move.Lizard)} />
                        {address === j2 &&
                            <>
                                <button onClick={playMove}>Play Move</button>
                            </>
                        }
                        {address === j1 &&
                            <>
                                <input value={salt} onChange={(e) => setSalt(e.target.value)} />
                                <button onClick={finalResult}>Calculate Final Result</button>
                            </>

                        }
                    </>
            }
        </div>

    )
}

export default PlayGame