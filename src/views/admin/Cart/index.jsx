import React from "react";
import ReactDOM from "react-dom";
import Francemap from "./components/Francemap";


const App = () => {
    return (
        <div>
            <h1>Carte de la France</h1>
            <Francemap />
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
