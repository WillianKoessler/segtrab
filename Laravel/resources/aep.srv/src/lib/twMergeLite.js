export default function twMergeLite(...classes) {
  const groups = new Map();
  for (const cls of classes.join(" ").split(/\s+/)) {
    const key =
      cls.startsWith("px-") ? "px" :
      cls.startsWith("py-") ? "py" :
      cls.startsWith("p-")  ? "p"  :
      cls.startsWith("mx-") ? "mx" :
      cls.startsWith("my-") ? "my" :
      cls.startsWith("m-")  ? "m"  :
      cls.startsWith("text-") ? "text" :
      cls;

    groups.set(key, cls);
  }

  return [...groups.values()].join(" ");
}