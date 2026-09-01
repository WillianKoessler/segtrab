import Section from "../layout/Section.js"

const SectionItem = (section, index) => {
    return {
        tag: 'a',
        className: "w-full flex items-center text-left text-lg sm:text-xl font-semibold text-gray-800 hover:text-blue-700 transition-colors print:pointer-events-none",
        href: "#" + section.id,
        children: [
            {
                tag: 'span',
                className: "bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 flex-shrink-0",
                children: String(index + 1)
            },
            {
                tag: 'span',
                className: 'uppercase',
                children: String(section.displayName)
            }
        ]
    }
}

export default function SectionSumario(sections) {
    return Section(null, null, "Sumário", [
        {
            tag: 'div',
            className: "space-y-3",
            children: sections.map(SectionItem)
        }
    ]);
}