import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Signer, providers } from "ethers";
import { RootState } from "@/redux/store";

export type WalletState = {
    isProviderPresent: boolean,
    provider: providers.Web3Provider,
    signer: Signer,
    address: string,
    error: string | undefined
}

export type ActionState = {
    payload: WalletState,
    type: string,
}


const initialState: WalletState = {
    isProviderPresent: false,
    provider: {} as providers.Web3Provider,
    signer: {} as Signer,
    address: "",
    error: undefined
}


export const getNewProvider = createAsyncThunk("provider/getNewProvider", async (_, { rejectWithValue }) => {
    if (window.ethereum === null) {
        return rejectWithValue("No Provider Found")
    }

    const provider = new providers.Web3Provider(window.ethereum);
    const chainID = await provider.getNetwork();

    try {
        if (chainID.chainId !== 80001) {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x13881" }]
            })
        }
    } catch (error) {
        return rejectWithValue("Could not switch network")
    }


    return provider;
})

// Event Listner, If accounts changes, logout
export const accountsChanged = createAction<void>("wallet/accountsChanged");

export const getNewSigner = createAsyncThunk("signer/getNewSigner", async (_, { rejectWithValue, getState, dispatch }) => {

    // Provider
    const state = getState() as RootState
    const provider = state.wallet.provider

    if (Object.keys(provider).length === 0) {
        return rejectWithValue("No Provider Found");
    }

    try {
        await provider.send("eth_requestAccounts", [])

        window.ethereum.on("accountsChanged", () => {
            dispatch(accountsChanged())
        })

        const signer = provider.getSigner();
        const address = await signer.getAddress();
        return {
            signer,
            address
        }
    } catch (error) {
        return rejectWithValue("Error Requesting Signers")
    }

})


const walletSlice = createSlice({
    name: "wallet",
    initialState,
    reducers: {
        logout: (state) => {
            state.address = "";
            state.signer = {} as Signer;
        }
    },
    extraReducers: builder => {
        builder.addCase(getNewProvider.fulfilled, (state, action) => {
            state.provider = action.payload;
            state.error = undefined;
            state.isProviderPresent = true;
        });
        builder.addCase(getNewProvider.rejected, (state, action) => {
            state.provider = {} as providers.Web3Provider;
            state.signer = {} as Signer;
            state.error = action.error.message;
            state.isProviderPresent = false;
        });
        builder.addCase(getNewSigner.fulfilled, (state, action) => {
            state.signer = action.payload.signer;
            state.address = action.payload.address
            state.error = undefined
        });
        builder.addCase(getNewSigner.rejected, (state, action) => {
            state.error = action.error.message
        });
        builder.addCase(accountsChanged, (state) => {
            state.signer = {} as Signer;
            state.address = ""
        })
    }
})

export default walletSlice.reducer
export const { logout } = walletSlice.actions