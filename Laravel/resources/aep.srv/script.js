import "./src/lib/KDOM.error.js"
import "./src/lib/KDOM.store.js"
import "./src/lib/KDOM.js"
import "./helpers.js"
import "./src/styles/globals.css";


import App from "./src/index.js";
const target = document.getElementById('root');
KDOM.render(App, target);
