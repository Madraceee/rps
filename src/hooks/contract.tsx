'use client'
import { RPSABI, RPSBytecode } from "@/contract/rpsContract";
import { RootState } from "@/redux/store"
import { HasherAbi__factory, RpsAbi__factory } from "@/types/ethers-contracts";
import { BigNumber, ContractFactory } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { createContext, useCallback, useContext, useState } from "react";
import { useSelector } from "react-redux"

export enum Move {
    Null,
    Rock,
    Paper,
    Scissors,
    Spock,
    Lizard
};

type contractInterface = {
    createGame: (playerTow: string, move: Move, salt: number, stake: string) => Promise<string>,
    play: (c2Move: Move) => Promise<void>,
    solve: (move: Move, salt: BigNumber) => Promise<void>,
    c1Timeout: (contractAddress: string) => Promise<void>,
    c2Timeout: (contractAddress: string) => Promise<void>
};

const contractContext = createContext<contractInterface>({} as contractInterface);

const ContractProvider = ({ children }: any) => {

    const signer = useSelector((state: RootState) => state.wallet.signer);
    const provider = useSelector((state: RootState) => state.wallet.provider);
    const address = useSelector((state: RootState) => state.wallet.address);

    const HasherAddress = "0xd6c52Ea4a725Ef3574E60F8a935b6e6bEe4Ce8CF"
    const [contractAddress, setContractAddress] = useState<string>("");

    const hash = async (move: Move, salt: BigNumber) => {
        console.log("Hasher", HasherAddress)
        if (HasherAddress !== undefined) {
            const contractFactory = HasherAbi__factory.connect(HasherAddress, provider)
            const hash = await contractFactory.hash(BigNumber.from(move), salt);
            return hash
        }

        throw new Error("Hasher Contract Not found");
    }

    const createGame = useCallback(async (playerTow: string, move: Move, salt: number, stake: string) => {
        const contractFactory = new ContractFactory(RPSABI, RPSBytecode, signer);

        const hashValue = hash(move, BigNumber.from(salt))
        const contract = await contractFactory.deploy(hashValue, playerTow, { value: parseUnits(stake, "gwei") });
        await contract.deployed();

        return contract.address
    }, [signer]);

    const play = useCallback(async (c2Move: Move) => {
        const contract = RpsAbi__factory.connect(contractAddress, signer);
        const stake = await contract.stake();
        await contract.play(BigNumber.from(c2Move), { value: stake })

    }, [signer, contractAddress]);

    const solve = useCallback(async (move: Move, salt: BigNumber) => {
        const contract = RpsAbi__factory.connect(contractAddress, signer);
        await contract.solve(BigNumber.from(move), salt);
    }, [signer, contractAddress]);

    const c1Timeout = useCallback(async (contractAddress: string) => {
        const contract = RpsAbi__factory.connect(contractAddress, signer);
        await contract.j1Timeout()
    }, [signer, contractAddress]);

    const c2Timeout = useCallback(async (contractAddress: string) => {
        const contract = RpsAbi__factory.connect(contractAddress, signer);
        await contract.j2Timeout()
    }, [signer, contractAddress]);


    // const changeContract = (newContractAddress: string) => {
    //     setContractAddress(newContractAddress);
    // }

    return (
        <contractContext.Provider value={{ createGame, play, solve, c1Timeout, c2Timeout }}>
            {children}
        </contractContext.Provider>
    )

}



export function useContract() {
    return useContext(contractContext);
};

export default ContractProvider