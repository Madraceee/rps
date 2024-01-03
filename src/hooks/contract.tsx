'use client'
import { RPSABI, RPSBytecode } from "@/contract/rpsContract";
import { RootState } from "@/redux/store"
import { HasherAbi__factory, RpsAbi__factory } from "@/types/ethers-contracts";
import { BigNumber, ContractFactory, utils } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import { createContext, useCallback, useContext } from "react";
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
    createGame: (playerTow: string, move: Move, salt: number, stake: string, valueType: string) => Promise<string>,
    play: (contractAddress: string, c2Move: Move) => Promise<string>,
    solve: (contractAddress: string, move: Move, salt: BigNumber) => Promise<string>,
    c1Timeout: (contractAddress: string) => Promise<string>,
    c2Timeout: (contractAddress: string) => Promise<string>,
    getContractInfo: (contractAddress: string) => Promise<{ stake: BigNumber, j1: string, j2: string, isTimeout: boolean, hasC2Played: boolean }>,
    isValidAddress: (address: string) => boolean
};

const contractContext = createContext<contractInterface>({} as contractInterface);

const ContractProvider = ({ children }: any) => {

    const signer = useSelector((state: RootState) => state.wallet.signer);
    const provider = useSelector((state: RootState) => state.wallet.provider);

    const HasherAddress = "0xd6c52Ea4a725Ef3574E60F8a935b6e6bEe4Ce8CF";

    const hash = async (move: Move, salt: BigNumber) => {
        if (HasherAddress !== undefined) {
            const contractFactory = HasherAbi__factory.connect(HasherAddress, provider)
            const hash = await contractFactory.hash(BigNumber.from(move), salt);
            return hash
        }

        throw new Error("Hasher Contract Not found");
    }

    const createGame = useCallback(async (playerTow: string, move: Move, salt: number, stake: string, valueType: string) => {
        try {
            const contractFactory = new ContractFactory(RPSABI, RPSBytecode, signer);
            const hashValue = hash(move, BigNumber.from(salt))
            const contract = await contractFactory.deploy(hashValue, playerTow, { value: parseUnits(stake, valueType) });
            await contract.deployed();

            return contract.address
        } catch (error: any) {
            if (error.message === "Hasher Contract Not found") {
                throw new Error("Hasher Contract Not found")
            } else {
                throw new Error("Could not deploy contract")
            }
        }

    }, [signer]);

    const play = useCallback(async (contractAddress: string, c2Move: Move) => {
        try {
            const contract = RpsAbi__factory.connect(contractAddress, signer);
            const stake = await contract.stake();
            const tx = await contract.play(BigNumber.from(c2Move), { value: parseUnits(stake.toString(), "wei") });
            return tx.hash;
        } catch (error) {
            throw new Error("Could not execute Transaction")
        }


    }, [signer]);

    const solve = useCallback(async (contractAddress: string, move: Move, salt: BigNumber) => {
        try {
            const contract = RpsAbi__factory.connect(contractAddress, signer);
            const tx = await contract.solve(BigNumber.from(move), salt);
            return tx.hash;
        } catch (error) {
            throw new Error("Could not execute Transaction");
        }

    }, [signer]);

    const c1Timeout = useCallback(async (contractAddress: string) => {
        try {
            const contract = RpsAbi__factory.connect(contractAddress, signer);
            const tx = await contract.j1Timeout();
            return tx.hash;
        } catch (error) {
            console.log(error)
            throw new Error("Could not Execute Timeout");
        }

    }, [signer]);

    const c2Timeout = useCallback(async (contractAddress: string) => {
        try {
            const contract = RpsAbi__factory.connect(contractAddress, signer);
            const tx = await contract.j2Timeout();
            return tx.hash;
        } catch (error) {
            throw new Error("Could not Execute Timeout");
        }
    }, [signer]);

    const getContractInfo = useCallback(async (contractAddress: string) => {
        const contract = RpsAbi__factory.connect(contractAddress, provider);
        const stake = await contract.stake();
        const j1 = await contract.j1();
        const j2 = await contract.j2();
        const c2 = await contract.c2()
        const lastAction = await contract.lastAction();

        const lastActionTime = new Date(lastAction.toNumber() * 1000);
        const timeoutTime = new Date(lastActionTime.getTime() + 5 * 60 * 1000);
        const currentTimestamp = Math.floor(Date.now() / 1000);

        let isTimeout = false;
        if (currentTimestamp > timeoutTime.getTime() / 1000) {
            isTimeout = true
        }

        let hasC2Played = false;
        if (c2 > 0) {
            hasC2Played = true;
        }

        return {
            stake,
            j1,
            j2,
            isTimeout,
            hasC2Played
        }
    }, [provider])

    const isValidAddress = (address: string) => {
        return utils.isAddress(address)
    }

    return (
        <contractContext.Provider value={{ createGame, play, solve, c1Timeout, c2Timeout, getContractInfo, isValidAddress }}>
            {children}
        </contractContext.Provider>
    )

}



export function useContract() {
    return useContext(contractContext);
};

export default ContractProvider