import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

const XmlDataComponent = () => {
    return (
        <div>
            <h2>Hey</h2>
            <form action="http://localhost:3001/dataByDate">
                <input type="date" id="start" name="trip-start" value="2018-07-22" min="2018-01-01" max="2018-12-31"/>
                <button type={"submit"}>Envoyer</button>
            </form>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<XmlDataComponent/>);
