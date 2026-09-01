import SectionSumario from "./sections/sumario.js";
import SECTIONS_MAP from "./sections/map.js";
// import { ControlPanelButton } from "./control/control.js";
import aepReducer from "./store.js";

window.aepStore = KDOM.createStore(aepReducer);
KDOM.registerStore(window.aepStore);

export default function App() {
    return {
        tag: 'div',
        className: "bg-white min-h-screen overflow-x-auto max-w-5xl mx-auto px-4 py-8",
        children: {
            tag: 'main',
            className: "mx-auto px-8 py-8 print:p-0 bg-white w-full overflow-x-auto text-gray-900",
            //"data-current-date": formatDate(new Date(), "dd/mm/YYYY"),
            children: [
                // ControlPanelButton,
                // SectionCoverPage,
                () => SectionSumario(SECTIONS_MAP.map(s => { return { id: s.id, displayName: s.name } })),
                ...(SECTIONS_MAP.map((s, i) => () => { return s.element(i + 1, s.id, s.name) }))
            ]
        }
    }
}
