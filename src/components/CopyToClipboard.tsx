'use client'
import { Clipboard, ClipboardCheck, ClipboardCopy } from "lucide-react"
import { Button } from "./ui/button"
import { useState } from "react"

type Props = {
    content: string
}

const CopyToClipBoard = ({ content }: Props) => {
    const [isSelected, setIsSelected] = useState<boolean>(false);

    const selected = () => {
        window.navigator.clipboard.writeText(content)
        setIsSelected(true)

        setTimeout(() => {
            setIsSelected(false)
        }, 1500)
    }
    return (
        <Button onClick={selected} className="w-fit h-fit">
            {isSelected ? <ClipboardCheck className="m-1 h-4 w-4" /> : <ClipboardCopy className="m-1 h-4 w-4" />}
        </Button>
    )
}

export default CopyToClipBoard