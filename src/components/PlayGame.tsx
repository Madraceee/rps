'use client'
import { useEffect, useState } from "react";
import MoveBtn from "./MoveBtn"
import { Move, useContract } from "@/hooks/contract";
import { BigNumber } from "ethers";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Loader from "./Loader";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";
import CopyToClipBoard from "./CopyToClipboard";

const PlayGame = () => {

    const [contractAddress, setContractAddress] = useState<string>("");
    const [showContract, setShowContract] = useState<boolean>(false);
    const [stake, setStake] = useState<BigNumber>();
    const [j1, setJ1] = useState<string>("");
    const [j2, setJ2] = useState<string>("");
    const [move, setMove] = useState<Move>(Move.Null);
    const [salt, setSalt] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [txLoading, setTxLoading] = useState<boolean>(false);
    const [tx, setTx] = useState<string>("")

    const { play, getContractInfo, solve, isValidAddress } = useContract();
    const address = useSelector((state: RootState) => state.wallet.address);

    const playMove = async () => {
        if (move === Move.Null) {
            toast({
                description: "Select move",
                variant: "destructive"
            });
            return;
        }

        setTxLoading(true)
        try {
            const tx = await play(contractAddress, move);
            setTx(tx)
        } catch (error) {
            toast({
                description: "Transaction Failed",
                variant: "destructive"
            });
        }
        setMove(Move.Null);
        setSalt("");
        setTxLoading(false)

    }

    const finalResult = async () => {
        if (move === Move.Null) {
            toast({
                description: "Select move",
                variant: "destructive"
            });
            return;
        }

        if (isNaN(parseInt(salt))) {
            toast({
                description: "Enter valid salt(Numerics)",
                variant: "destructive"
            })
            setSalt("")
            return;
        }

        setTxLoading(true)
        try {
            const tx = await solve(contractAddress, move, BigNumber.from(salt));
            setTx(tx)
        } catch (error) {
            toast({
                description: "Transaction Failed",
                variant: "destructive"
            });
        }

        setMove(Move.Null);
        setSalt("");
        setTxLoading(false)
    }


    async function getInfo() {
        if (!isValidAddress(contractAddress)) {
            toast({
                title: "Wrong Value",
                description: "Enter valid Address",
                variant: "destructive"
            })
            setContractAddress("")
            return;
        }
        setLoading(true)
        const contractInfo = await getContractInfo(contractAddress);
        setStake(contractInfo.stake)
        setJ1(contractInfo.j1)
        setJ2(contractInfo.j2)

        setLoading(false)
        setShowContract(true)
    }

    return (
        <div className="flex flex-col gap-2 items-start w-full">
            <div className="flex flex-row gap-2 w-full">
                <Input value={contractAddress} onChange={(e) => setContractAddress(e.target.value)} placeholder="Enter Contract Address" />
                <Button onClick={getInfo}>Open Game</Button>
            </div>
            {showContract || loading ? <Separator /> : null}
            {loading ? <div className="w-full flex flex-row justify-center align-middle my-5"><Loader /></div> : null}
            {showContract ?
                address !== j1 && address !== j2 ?
                    <p>You cannot play this match</p> :
                    <>
                        <div className="font-light">
                            <p><span className="font-bold">Stake :</span> {stake?.toString()}</p>
                            <p><span className="font-bold">Player 1 :</span> {j1}</p>
                            <p><span className="font-bold">Player 2 :</span> {j2}</p>
                        </div>

                        {stake?.toString() === "0" ?
                            <p className="mx-auto text-2xl mt-3 font-extrabold">GAME OVER</p>
                            :
                            (
                                <>
                                    {
                                        address === j2 ?
                                            <p className="text-left">This is player 2's turn</p> : <p>Player 1, confirm your move</p>
                                    }
                                    <p className="font-bold mt-2">Select Move</p>
                                    <div className="flex flex-wrap flex-row gap-2 w-full justify-between" >
                                        <MoveBtn text="Rock" onClick={() => setMove(Move.Rock)} isSelected={move === 1} />
                                        <MoveBtn text="Paper" onClick={() => setMove(Move.Paper)} isSelected={move === 2} />
                                        <MoveBtn text="Scissors" onClick={() => setMove(Move.Scissors)} isSelected={move === 3} />
                                        <MoveBtn text="Spock" onClick={() => setMove(Move.Spock)} isSelected={move === 4} />
                                        <MoveBtn text="Lizard" onClick={() => setMove(Move.Lizard)} isSelected={move === 5} />
                                    </div>
                                    {
                                        address === j2 &&
                                        <>
                                            <Button onClick={playMove} className="w-fit mx-auto" disabled={txLoading}>
                                                {txLoading ?
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Loading
                                                    </> :
                                                    <>Play Move</>
                                                }

                                            </Button>
                                        </>
                                        ||
                                        address === j1 &&
                                        <>
                                            <Input value={salt} onChange={(e) => setSalt(e.target.value)} placeholder="Enter Salt" />
                                            <Button onClick={finalResult} className="w-fit mx-auto" disabled={txLoading}>
                                                {txLoading ?
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Loading
                                                    </> :
                                                    <>Calculate Final Result</>
                                                }

                                            </Button>
                                        </>
                                    }
                                    { }
                                </>
                            )
                        }
                        {tx !== "" ?
                            <p className="text-center">
                                Transaction : <span className="font-bold">{tx} <CopyToClipBoard content={tx} /></span>
                            </p> : null
                        }

                    </> : null
            }
        </div>

    )
}

export default PlayGame