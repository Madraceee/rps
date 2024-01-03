import { shortenAddress } from "@/lib/utils"
import { Button } from "./ui/button"

type Props = {
    address: string,
    logout: () => void
}

const NavBar = ({ address, logout }: Props) => {
    return (
        <div className="z-10 w-full bg-black border-b-2 border-b-gray-400 flex flex-row justify-between items-center p-1">
            <p className="font-bold text-2xl ml-3">RPS</p>
            <div className="flex flex-row justify-end gap-5 items-center">
                <p className="font-bold text-xl">{shortenAddress(address)}</p>
                <Button onClick={logout}>Logout</Button>
            </div>
        </div>
    )
}

export default NavBar;