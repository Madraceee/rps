import Image from "next/image"

type Props = {
    text: string,
    onClick: () => void
}

const MoveBtn = ({ text, onClick }: Props) => {
    const image = `/image/${text}.png`
    return (
        <div onClick={onClick}>
            <Image
                src={image}
                width={100}
                height={100}
                alt="Icon"
            />
            <p>{text}</p>
        </div>
    )
}

export default MoveBtn