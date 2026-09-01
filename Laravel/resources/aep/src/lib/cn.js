import clsx from "./clsx.js";
import twMergeLite from "./twMergeLite.js";

export default function cn(...inputs) {
    return twMergeLite(clsx(inputs));
}