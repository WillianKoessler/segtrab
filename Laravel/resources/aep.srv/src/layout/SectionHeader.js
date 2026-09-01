export default function SectionHeader(index, name) {
    return {
        tag: "h2",
        className: index
            ? "text-xl sm:text-3xl font-bold text-gray-900 mb-6 border-b-4 border-blue-600 pb-3 scroll-mt-32"
            : "text-2xl sm:text-4xl font-bold text-gray-900 mb-8 border-b-4 border-blue-600 pb-4 uppercase",
        children: [
            index
                ? {
                    tag: 'span',
                    className: "bg-blue-600 text-white rounded-full w-10 h-10 inline-flex items-center justify-center text-lg font-bold mr-4",
                    children: String(index)
                } : null,
            String(name).toUpperCase()
        ]
    };
}