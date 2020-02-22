import * as preact from "/preact";
import Component from "../Component";

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        
    }

    render(props, state, context) {
        return(
            preact.createElement("div", null, "")
        );
    }
}

App.namespace = "index";