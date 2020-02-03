import "/preact";

// apply bind(this) to every function in component class so "this" can be used inside member functions of the class
export default class Component extends preact.Component {
    constructor(...args) {
        super(args);
        for(const key of Object.getOwnPropertyNames(this.constructor.prototype)) {
            if(key !== "constructor" && typeof this[key] === "function") {
                this[key] = this[key].bind(this);
            }
        }
    }
}
