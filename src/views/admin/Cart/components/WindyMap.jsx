import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const WindyMap = () => {
    useEffect(() => {
        const options = {
            // Required: API key
            key: 'PsLAtXpsPTZexBwUkO7Mx5I', // REPLACE WITH YOUR KEY !!!

            // Put additional console output
            verbose: true,

            // Optional: Initial state of the map
            lat: 50.4,
            lon: 14.3,
            zoom: 5,
        };

        // Function to initialize Windy API
        const windyInit = (options, callback) => {
            const script = document.createElement('script');
            script.src = `https://api.windy.com/assets/map-forecast/libBoot.js?key=${options.key}&lat=${options.lat}&lon=${options.lon}&zoom=${options.zoom}`;
            script.async = true;
            script.onload = () => {
                const windyAPI = window.W.windyAPI;
                if (callback && typeof callback === 'function') {
                    callback(windyAPI);
                }
            };

            script.onerror = (error) => {
                console.error('Erreur lors du chargement de la carte Windy:', error);
            };

            document.body.appendChild(script);
        };

        // Call windyInit with options
        windyInit(options, windyAPI => {
            // windyAPI is ready, and contain 'map', 'store',
            // 'picker' and other useful stuff
            const { map } = windyAPI;
            // .map is instance of Leaflet map

            L.popup()
                .setLatLng([options.lat, options.lon])
                .setContent('Hello World')
                .openOn(map);
        });
    }, []);

    return (
        <div id="windy" style={{ width: '100%', height: '400px' }}></div>
    );
};

export default WindyMap;
