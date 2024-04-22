import React, { useRef, useEffect, useState } from "react";
import L from 'leaflet';
import "leaflet/dist/leaflet.css"; // Toujours il faut mettre à jour
import axios from 'axios';
import Card from "components/card";
import "./Card.css";
import "https://api.windy.com/assets/map-forecast/libBoot.js";
import { format } from 'date-fns';
import stationsGeographiques from './stations_geographiques.json';
import 'leaflet.markercluster/dist/leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';






//import "https://unpkg.com/leaflet@1.4.0/dist/leaflet.js";


// Composant de la carte de France
const Francemap = () => {
    // de nombreuses références
    const mapRef = useRef(null);
    const [map, setMap] = useState(null);
    const windyMapRef = useRef(null);
    //const [windyMap, setWindyMap] = useState(null);
    const [darkMode, setDarkMode] = useState(false);
    const [showWindVector, setShowWindVector] = useState(false);
    const [showDepartments, setShowDepartments] = useState(true);
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [showHourlyDetails, setShowHourlyDetails] = useState(false);
    const [dailyForecastDetails, setDailyForecastDetails] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchError, setSearchError] = useState('');
    const [searchedCityCoord, setSearchedCityCoord] = useState(null);
    const API_KEY = 'db761d1af3f3fdafa075b08d40008b32';
    const WINDY_API_KEY = 'KIRAUHiHcBVogEwp3PROlExIqKwAQ4e3';
    const latitude = 48.8566; // Latitude de Paris
    const longitude = 2.3522; // Longitude de Paris
    const [citySuggestions, setCitySuggestions] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [markerClusters, setMarkerClusters] = useState([]);


    ///// Suggestions Ville ////

    const getCitySuggestions = async (query) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`);
            setCitySuggestions(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des suggestions de villes :', error);
        }
    };



    // Chargement de l'API Windy //

    const loadWindyAPI = () => {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://api.windy.com/assets/map-forecast/libBoot.js";
            script.async = true;
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
        });
    };
    // initialisation de la carte Windy
    const initWindyMap = async () => {
        if (windyMapRef.current) {
            try {
                await loadWindyAPI();

                const options = {
                    key: WINDY_API_KEY,
                    lat: 48.8566,
                    lon: 2.3522,
                    zoom: 5,
                };

                window.windyInit(options, windyAPI => {
                    console.log(windyAPI);
                    windyMapRef.current = windyAPI.map;

                    const { picker, utils, broadcast, store } = windyAPI;

                    picker.on('pickerOpened', ({ lat, lon, values, overlay }) => {
                        console.log('opened', lat, lon, values, overlay);

                        const windObject = utils.wind2obj(values);
                        console.log(windObject);
                    });

                    picker.on('pickerMoved', ({ lat, lon, values, overlay }) => {
                        console.log('moved', lat, lon, values, overlay);
                    });

                    picker.on('pickerClosed', () => {
                    });

                    store.on('pickerLocation', ({ lat, lon }) => {
                        console.log(lat, lon);

                        const { values, overlay } = picker.getParams();
                        console.log('location changed', lat, lon, values, overlay);
                    });

                    broadcast.once('redrawFinished', () => {
                        picker.open({ lat: 48.8566, lon: 2.3522 });
                    });

                    const overlays = ['rain', 'wind', 'temp', 'clouds'];
                    let i = 0;

                    setInterval(() => {
                        i = i === 5 ? 0 : i + 1;
                        store.set('overlay', overlays[i]);
                    }, 800);

                    broadcast.on('paramsChanged', params => {
                        console.log('Params changed:', params);
                    });

                    broadcast.on('redrawFinished', params => {
                        console.log('Map was rendered:', params);
                    });

                });
            } catch (error) {
                console.error("Erreur lors du chargement de l'API Windy :", error);
            }
        }
    };

    useEffect(() => {
        initWindyMap();
    }, []);


    ////////////////// ------------------------- ////////////////////////
    // Qualité de l'air //








    // Effet pour initialiser la carte Leaflet SAE //
    useEffect(() => {
        if (!map) {
            const myMap = L.map(mapRef.current).setView([48.8566, 2.3522], 5);

            const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors - SAE 4.01'
            });
            tileLayer.addTo(myMap);

            const temperatureLayer = L.tileLayer(`http://{s}.tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`, {
                attribution: 'OpenWeatherMap',
                opacity: 0.6
            });
            temperatureLayer.addTo(myMap);

            myMap.on('click', handleMapClick);

            setMap(myMap);
        }
        toggleDepartments();
    }, [map]);



    // Effet afin de mettre à jour la carte Leaflet si les coordonnées de la ville citée changent
    useEffect(() => {
        if (searchedCityCoord && map) {
            map.setView([searchedCityCoord.lat, searchedCityCoord.lon], 10);
        }
    }, [searchedCityCoord, map]);

    // Fonction pour mettre en place le click dans la carte afin d'afficher les informations/données météorologiques de la ville citée
    const handleMapClick = (event) => {
        const { lat, lng } = event.latlng;
        setSearchQuery('');
        setSearchError('');
        setSearchedCityCoord({ lat, lon: lng });
        fetchWeatherData(lat, lng);
    };

    // Fonction afin de récupérer des données météorologiques avec de la latitude et de longitude
    const fetchWeatherData = (lat, lon) => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
            .then(response => {
                setWeatherData(response.data);
                const { coord, name, weather, main, timezone } =response.data;
                if (coord) {
                    addCityMarker(coord.lat, coord.lon, name, descriptionMeteo[weather[0].description], main.temp, timezone);
                }
                const background = backgroundImages[weather[0].main];
                document.body.style.backgroundImage = background;
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    };

    const backgroundImages = {
        'Clear': '',
        'Clouds': '',
        'Rain': '',
    };

    // Fonction pour récupérer des données de prévisions sur 5 jours
    const fetchForecastData = () => {
        const endpoint = searchedCityCoord ? `lat=${searchedCityCoord.lat}&lon=${searchedCityCoord.lon}` : `lat=${latitude}&lon=${longitude}`;
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?${endpoint}&appid=${API_KEY}&units=metric`)
            .then(response => {
                setForecastData(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des prévisions météo sur 5 jours :', error);
            });
    };


    useEffect(() => {
        // Appel des fonctions afin de réaliser la récupération les données de météo et ses prévisions
        fetchWeatherData(latitude, longitude);
        fetchForecastData(latitude, longitude);
    }, []);
    // Fonction pour mettre des coutours de regions en json en mettant des layer sur chaque région
    const toggleDepartments = () => {
        setShowDepartments(!showDepartments);
        if (map) {
            if (!showDepartments) {
                map.eachLayer(layer => {
                    if (layer.feature && layer.feature.properties && layer.feature.properties.code) {
                        map.removeLayer(layer);
                    }
                });
                markerClusters.forEach(cluster => map.removeLayer(cluster));
            } else {
                fetch('https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions.geojson')
                    .then(response => response.json())
                    .then(data => {
                        L.geoJSON(data, {
                            style: {
                                color: '#3388ff',
                                weight: 1.5
                            },
                        }).addTo(map);
                        addMarkers();
                    });
            }
        }
    };


    ///// stations_géo ////
    // Fonction pour ajouter les marqueurs de stations en fonction de la carte actuelle //
    const addMarkers = () => {
        const regionMarkers = {};

        stationsGeographiques.forEach(station => {
            const region = station['Région'];
            if (!regionMarkers[region]) {
                regionMarkers[region] = L.markerClusterGroup();
            }

            const marker = L.marker([station['Latitude'], station['Longitude']]);
            marker.bindPopup(`<strong>${station['Nom station']}</strong><br>Code station : ${station['Code station']}<br>Région : ${station['Région']}`);
            regionMarkers[region].addLayer(marker);
            markers.push(marker);
        });

        for (const region in regionMarkers) {
            markerClusters.push(regionMarkers[region]);
            map.addLayer(regionMarkers[region]);
        }
    };


    const getWeatherData = async (lat, lon) => {
        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
            const { main, weather } = response.data;
            return { temp: main.temp, humidity: main.humidity, conditions: weather[0].description };
        } catch (error) {
            console.error(error);
            return null;
        }
    };



    //// ////
    // Fonction afin de changer de mode foncé
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        const tileLayerUrl = darkMode ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
        map.eachLayer(layer => {
            if (layer instanceof L.TileLayer) {
                layer.setUrl(tileLayerUrl);
            }
        });
    };

    const toggleWindVector = () => {
        setShowWindVector(!showWindVector);
    };
// Fonction afin de changer de mode foncé
    const toggleNightMap = () => {
        setDarkMode(!darkMode);
        const tileLayerUrl = darkMode ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' : 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png';
        map.eachLayer(layer => {
            if (layer instanceof L.TileLayer) {
                layer.setUrl(tileLayerUrl);
            }
        });
    };
    // Fonction afin d'ajouter un marqueur de ville dans la carte
    const addCityMarker = (lat, lon, cityName, weatherDescription, temperature, timezone, humidity) => {
        if (map) {
            const customIcon = L.divIcon({
                className: 'custom-marker-icon',
                html: `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" >
                    <circle cx="16" cy="16" r="14" fill="#3388FF" stroke="white" stroke-width="2"/>
                    <text x="50%" y="50%" text-anchor="middle" alignment-baseline="central" font-family="Arial, sans-serif" font-size="12px" fill="white">${temperature}°</text>
               </svg>`
            });

            const marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);

            const popupContent = `
        <div class="popup">
            <div class="popup-header">
                <h3>${cityName}</h3>
            </div>
            <div class="popup-body">
                <p>Dans ce temps, il y a : ${weatherDescription}</p>
                <ul>
                    <p>Latitude : ${lat} | Longitude : ${lon}</p>
                    <p>Humidité : ${humidity}%</p>
                    <p>La température est de ${temperature} degrès °C et la vitesse du vent est de : ${weatherData.wind.speed} m/s</p>
                    <p>Nous sommes le ${getLocalDate(timezone)}, il est actuellement à ${getLocalTime(timezone)}</p>         
                </ul>
            </div>
        </div>
    `;

            marker.bindPopup(popupContent).openPopup();
        }
    };

    // Fonction pour afficher les suggestions de la ville choisie //
    const searchWeather = () => {
        if (!searchQuery) {
            setSearchError('Veuillez saisir une ville.');
            return;
        }

        getCitySuggestions(searchQuery);

        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${searchQuery}&appid=${API_KEY}&units=metric`)
            .then(response => {
                const { coord, name, weather, main } = response.data;
                if (coord) {
                    setSearchedCityCoord(coord);
                    setSearchError('');

                    if (windyMapRef.current) {
                        const options = {
                            key: WINDY_API_KEY,
                            lat: coord.lat,
                            lon: coord.lon,
                            zoom: 5,
                        };
                        window.windyInit(options, windyAPI => {
                            console.log('Carte Windy initialisée avec succès pour la ville recherchée.');

                            const { picker, utils, broadcast, store } = windyAPI;

                            picker.on('pickerOpened', ({ lat, lon, values, overlay }) => {
                                console.log('opened', lat, lon, values, overlay);

                                const windObject = utils.wind2obj(values);
                                console.log(windObject);
                            });

                            picker.on('pickerMoved', ({ lat, lon, values, overlay }) => {
                                console.log('moved', lat, lon, values, overlay);
                            });

                            picker.on('pickerClosed', () => {
                            });

                            store.on('pickerLocation', ({ lat, lon }) => {
                                console.log(lat, lon);

                                const { values, overlay } = picker.getParams();
                                console.log('location changed', lat, lon, values, overlay);
                            });

                            broadcast.once('redrawFinished', () => {
                                picker.open({ lat: coord.lat, lon: coord.lon });
                            });

                            const overlays = ['rain', 'wind', 'temp', 'clouds'];
                            let i = 0;

                            setInterval(() => {
                                i = i === 5 ? 0 : i + 1;
                                store.set('overlay', overlays[i]);
                            }, 800);

                            broadcast.on('paramsChanged', params => {
                                console.log('Params changed:', params);
                            });

                            broadcast.on('redrawFinished', params => {
                                console.log('Map was rendered:', params);
                            });
                        });
                    }
                    setMap(map => {
                        map.panTo([coord.lat, coord.lon]);
                        return map;
                    });
                    /// ------- ///////
                    axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${API_KEY}&units=metric`)
                        .then(response => {
                            setForecastData(response.data);
                            const dailyForecastDetails = [];
                            let currentDay = null;

                            response.data.list.forEach(detail => {
                                const date = new Date(detail.dt * 1000);
                                const day = date.toLocaleDateString('default', { weekday: 'long' });

                                if (day !== currentDay) {
                                    currentDay = day;
                                    dailyForecastDetails.push({
                                        day,
                                        details: [detail]
                                    });
                                } else {
                                    dailyForecastDetails[dailyForecastDetails.length - 1].details.push(detail);
                                }
                            });

                            setDailyForecastDetails(dailyForecastDetails);
                        })
                        .catch(error => {
                            console.error('Erreur lors de la récupération des prévisions météorologiques :', error);
                        });


                    //// ----- //////
                    fetchWeatherData(coord.lat, coord.lon);
                    fetchForecastData(coord.lat, coord.lon);
                    addCityMarker(coord.lat, coord.lon, name, descriptionMeteo[weather[0].description], main.temp);
                }
                setWeatherData(response.data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération de la météo pour la ville spécifiée :', error);
                setSearchError('Impossible de trouver la météo pour la ville spécifiée.');
            });
    };

    // Fonction pour mettre les url images de données météorologiques //
    const getWeatherIconUrl = (iconCode) => {
        return `https://openweathermap.org/img/w/${iconCode}.png`;
    };
    // Fonction afin de prévisionner les données météorologiques //
    const showDailyForecast = () => {
        setShowHourlyDetails(false);
        const dailyForecast = [];
        if (forecastData) {
            const dailyData = {};
            forecastData.list.forEach(item => {
                const date = new Date(item.dt * 1000);
                const day = date.toLocaleDateString('default', { weekday: 'long' });
                if (!dailyData[day]) {
                    dailyData[day] = [];
                }
                dailyData[day].push(item);
            });
            Object.keys(dailyData).forEach(day => {
                dailyForecast.push({
                    day,
                    details: dailyData[day]
                });
            });
        }
        setDailyForecastDetails(dailyForecast);
    };
    // Fonction afin de prévisionner les horaires quotidiennes pour un jour précis (ex: Mardi)
    const showHourlyForecast = (index) => {
        setShowHourlyDetails((prevState) => {
            const newState = [...prevState];
            newState[index] = true;
            return newState;
        });
        setDailyForecastDetails(null);
    };
    // Fonction de traduction de langues de Anglais en Francais
    const descriptionMeteo = {
        "clear sky": "Ciel dégagé",
        "few clouds": "Quelques nuages",
        "scattered clouds": "Nuages épars",
        "broken clouds": "Nuages fragmentés",
        "overcast clouds": "Ciel couvert",
        "light rain": "Pluie légère",
        "moderate rain": "Pluie modérée",
        "heavy intensity rain": "Pluie intense",
    }
    // Fonction pour afficher les heures locaux de la ville citée
    const getLocalTime = (timezoneOffset) => {
        const currentDate= new Date();
        const utcTimestamp = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000);
        const localTimestamp = utcTimestamp + (timezoneOffset * 1000);
        const localDate = new Date(localTimestamp);
        return localDate.toLocaleTimeString('default', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    // Fonction pour afficher les dates actuelles de la ville citée en fonction du décalage horaine dans le monde
    const getLocalDate = (timezoneOffset) => {
        const currentDate = new Date();
        const UTCTimestamp = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000);
        const localTimesstamp = UTCTimestamp + (timezoneOffset * 1000);
        const localDate = new Date(localTimesstamp);
        return localDate.toLocaleDateString("fr-FR", {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const searchWindyCity = () => {
        const city = searchQuery.trim();
        if (city) {
            console.log(`Recherche de la ville : ${city} `);
        }
    };
    // Fonction pour mettre les détails sur l'heure spcifique de la ville mentionnée
    const toggleHourlyDetails = (index) => {
        setShowHourlyDetails((prevState) => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    useEffect(() => {
        if (dailyForecastDetails) {
            const details = [];
            for (let i = 0; i < dailyForecastDetails.length; i++) {
                details.push(false);
            }
            setShowHourlyDetails(details);
        }
    }, [dailyForecastDetails]);



    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col h-full">
                <Card extra="rounded-[30px] p-3">
                    <div className="text-center">
                        <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-4">
                            Carte de la France
                        </h4>
                    </div>

                    <div className="map-container" style={{height: "300px"}}>
                        <div ref={mapRef} className="map" style={{height: "100%"}}/>
                    </div>
                    <div className="legend">
                        Légende :
                        <div className="legend-item">
                            <span className="legend-color" style={{backgroundColor: '#3388ff'}}/>
                            Départements
                        </div>
                    </div>
                    <div className="text-center mt-4 space-x-2 weather-input">
                        <input
                            type="text"
                            placeholder="Recherche de ville..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                getCitySuggestions(e.target.value);
                            }}
                            className="custom-input"
                        />
                        <button onClick={searchWeather} className="custom-btn btn-sm">
                            Rechercher
                        </button>
                        <div className="mt-2 text-center text-red-500">
                            {searchError}
                        </div>
                    </div>
                    <div className="text-center mt-4 space-x-2">
                        <button onClick={toggleDarkMode} className="custom-btn btn-sm">
                            {darkMode ? "Mode Clair" : "Mode Sombre"}
                        </button>
                        <button onClick={toggleDepartments} className="custom-btn btn-sm">
                            {showDepartments ? "Afficher les régions (stations)" : "Masquer les régions (stations)"}
                        </button>
                        <button onClick={toggleNightMap} className="custom-btn btn-sm">
                            {darkMode ? "Carte Standard" : "Carte Sombre"}
                        </button>
                    </div>
                </Card>
            </div>
            <div className="flex">
                <div className="w-full md:w-1/2 p-3">
                    {weatherData && (
                        <Card extra="rounded-[30px] p-3">
                            <div className="text-center weather-widget">
                                <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-4">
                                    <i className="fas fa-map-marker-alt"></i>
                                    Météo actuelle à {weatherData.name}, {weatherData.sys.country}
                                </h4>
                                <div className="weather-details flex flex-col items-center justify-center">
                                    <p className="text-sm text-gray-600">
                                        Date locale : {new Date().toLocaleString('fr-FR', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric'
                                    })} | {new Date().toLocaleTimeString('default', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })} | Date et Heure de la ville recherchée
                                        : {getLocalDate(weatherData.timezone)} | {getLocalTime(weatherData.timezone)}
                                    </p>
                                    <p className="text-2xl font-bold text-navy-700 dark:text-white">{descriptionMeteo[weatherData.weather[0].description]}</p>
                                    <img src={getWeatherIconUrl(weatherData.weather[0].icon)}
                                         alt={descriptionMeteo[weatherData.weather[0].description]}
                                         className="weather-icon"/>
                                    <p className="text-lg font-bold text-navy-700 dark:text-white">
                                        Température : <span
                                        className="text-5xl font-bold">{weatherData.main.temp}</span> °C
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Humidité : {weatherData.main.humidity}% |
                                        Vent : {weatherData.wind.speed} m/s
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Min : {weatherData.main.temp_min} °C | Max : {weatherData.main.temp_max} °C
                                    </p>
                                </div>
                            </div>
                            <div className="w-full p-3">
                                <div className="text-center">
                                    <button onClick={showDailyForecast}
                                            className={`custom-btn btn-sm ${!showHourlyDetails ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                        Prévisions par jour
                                    </button>
                                </div>


                                {dailyForecastDetails && (
                                    <div className="mt-4">
                                        {dailyForecastDetails.map((dailyForecast, index) => {
                                            const minTemp = Math.min(...dailyForecast.details.map(detail => detail.main.temp));
                                            const maxTemp = Math.max(...dailyForecast.details.map(detail => detail.main.temp));

                                            return (
                                                <div key={index} className="mb-4">
                                                    <div className="flex flex-col md:flex-row">
                                                        <div className="w-full md:w-1/2">
                                                            <h4 className="text-lg font-bold text-navy-700 dark:text-white">{dailyForecast.day}</h4>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center">
                                                                    <img
                                                                        src={getWeatherIconUrl(dailyForecast.details[0].weather[0].icon)}
                                                                        alt={dailyForecast.details[0].weather[0].description}
                                                                        className="w-16 h-16 mr-2"
                                                                    />
                                                                    <div>
                                                                        <p className="text-xl font-bold">{dailyForecast.details[0].main.temp.toFixed(0)}°C</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <p>Humidité
                                                                        : {dailyForecast.details[0].main.humidity}%</p>
                                                                    <p>Vent
                                                                        : {dailyForecast.details[0].wind.speed} m/s</p>
                                                                </div>
                                                            </div>
                                                            <p>{descriptionMeteo[dailyForecast.details[0].weather[0].description]}</p>
                                                        </div>
                                                        <div
                                                            className="w-full md:w-1/2 flex items-center justify-center">
                                                            <div className="flex items-center">
                                                                <p className="text-xl font-bold mr-2">L: {minTemp.toFixed(0)}°C</p>
                                                                <p className="text-xl font-bold">H: {maxTemp.toFixed(0)}°C</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <button onClick={() => showHourlyForecast(index)}
                                                                className="mt-4 md:mt-0 md:ml-4 btn btn-primary">
                                                            Afficher les prévisions par heure
                                                        </button>

                                                        <button onClick={() => toggleHourlyDetails(index)}
                                                                className="mt-4 md:mt-0 md:ml-4 btn btn-primary">
                                                            {showHourlyDetails[index] ? 'Masquer les prévisions horaires' : 'Afficher les prévisions horaires'}
                                                        </button>
                                                    </div>
                                                    {showHourlyDetails[index] && (
                                                        <div className="flex mt-2 overflow-x-scroll scrollbar-hide">
                                                            {dailyForecast.details.map((detail, index) => (
                                                                <div key={index} className="mb-4"
                                                                     style={{marginBottom: '10px'}}>
                                                                    <div className="text-center">
                                                                        <p>{new Date(detail.dt * 1000).toLocaleTimeString('default', {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}</p>
                                                                        <img
                                                                            src={getWeatherIconUrl(detail.weather[0].icon)}
                                                                            alt={detail.weather[0].description}
                                                                            className="weather-icon inline-block"/>
                                                                        <p>{detail.main.temp} °C</p>
                                                                        <p className="mr-4">{descriptionMeteo[detail.weather[0].description]}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                {showHourlyDetails && forecastData && (
                                    <div className="flex mt-4 overflow-x-scroll scrollbar-hide">
                                        {forecastData.list.map((forecast, index) => (
                                            <div key={index} className="mr-4">
                                                <div className="text-center">
                                                    <p>{new Date(forecast.dt * 1000).toLocaleTimeString('default', {
                                                        hour: '2-digit',
                                                        hour12: false,
                                                        minute: '2-digit'
                                                    })}</p>
                                                    <img src={getWeatherIconUrl(forecast.weather[0].icon)}
                                                         alt={forecast.weather[0].description}
                                                         className="weather-icon"/>
                                                    <p>{forecast.main.temp} °C</p>
                                                    <p>{descriptionMeteo[forecast.weather[0].description]}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>
                <div className="w-full md:w-1/2 p-3">
                    <Card extra="rounded-[30px] p-3 h-full">
                        <div className="text-center">
                            <h4 className="text-lg font-bold text-navy-700 dark:text-white mb-4">
                                La carte des vents
                            </h4>
                            <div className="windy-container">
                                <div id="windy" ref={windyMapRef}></div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Francemap;
























