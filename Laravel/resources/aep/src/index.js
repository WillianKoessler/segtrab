import SectionSumario from "./sections/sumario.js";
import SECTIONS_MAP from "./sections/map.js";
// import { ControlPanelButton } from "./control/control.js";
import aepReducer from "./store.js";
import SectionCoverPage from "./sections/cover-page.js";

window.aepStore = KDOM.createStore(aepReducer, KDOM.persistState("aepState"));
KDOM.registerStore(window.aepStore);

export default function App() {
    return {
        tag: 'div',
        className: "max-w-5xl mx-auto h-screen",
        children: [
            // ControlPanelButton,
            SectionCoverPage,
            {
                tag: 'main',
                className: "mx-auto p-8 bg-white w-full text-gray-900",
                children: [
                    () => SectionSumario(SECTIONS_MAP.map(s => { return { id: s.id, displayName: s.name } })),
                    ...(SECTIONS_MAP.map((s, i) => () => { return s.element(i + 1, s.id, s.name) }))
                ]
            }
        ]
    }
}
