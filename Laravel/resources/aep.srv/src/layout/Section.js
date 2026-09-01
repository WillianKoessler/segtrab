import SectionHeader from "./SectionHeader.js";

export default function Section(index, id, title, children = null) {
    return {
        tag: "section",
        className: "mb-12 print:break-after-page",
        id: id,
        children: [
            () => SectionHeader(index, title),
            ...(children || [])
        ]
    };
}