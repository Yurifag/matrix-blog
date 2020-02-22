import * as preact from "/preact";

export default class ComponentLoader {
    static load(App) {
        preact.render(preact.createElement(App, {}), document.getElementById("content"));
    }
}
