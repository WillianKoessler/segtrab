import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function sleep(ms) {
    await (new Promise(resolve => setTimeout(resolve, Math.random() * 2000)));
}