import { Move } from "@/hooks/contract"
import Image from "next/image"

type Props = {
    text: string,
    onClick: () => void,
    isSelected: boolean
}

const MoveBtn = ({ text, onClick, isSelected }: Props) => {
    const image = `/image/${text}.png`
    return (
        <div onClick={onClick} className={`hover:cursor-pointer hover:scale-105 transition-transform p-3 rounded text-[#0B0B0B] shadow-[#BDBDBD] shadow-sm ${isSelected ? "bg-[#29B354] " : "bg-[#FAFAFA] "}`}>
            <Image
                src={image}
                width={100}
                height={100}
                alt="Icon"
            />
            <p className="text-center">{text}</p>
        </div>
    )
}

export default MoveBtn