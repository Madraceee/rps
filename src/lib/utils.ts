import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenAddress(address: string) {
  return address.slice(0, 4) + "..." + address.slice(address.length - 5, address.length)
}

export function shortenTxHash(txHash: string) {
  return txHash.slice(0, 6) + "..." + txHash.slice(txHash.length - 3, txHash.length)
}