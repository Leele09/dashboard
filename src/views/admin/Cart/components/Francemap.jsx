import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const FranceMap = () => {
    return (
        <div style={{ width: "100%", height: "auto" }}>
            <ComposableMap projection="geoMercator" projectionConfig={{ scale: 6000 }}>
                <Geographies geography={process.env.PUBLIC_URL + "/France.json"}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#EAEAEC"
                                stroke="#D6D6DA"
                            />
                        ))
                    }
                </Geographies>
            </ComposableMap>
        </div>
    );
};

export default FranceMap;
