import { GoogleMap, Marker, Circle } from "@react-google-maps/api";
import { useEffect, useState } from "react";

import { InfoWindow } from "@react-google-maps/api";
import React from "react";
import { defaultCenter } from "../constants";
import "./Map.css";

import { FaLocationCrosshairs } from "react-icons/fa6";

function Map({
  map,
  setMap,
  setMapSettings,
  mapSettings,
  places,
  setPlaces,
  setDisplayedPlaces,
  selectedPlace,
  setSelectedPlace,
}) {
  const [mapContainerStyle, setMapContainerStyle] = useState({
    width: "80vw",
    height: "80vw", // Default values for mobile
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        // Adjust the breakpoint for desktop as needed
        setMapContainerStyle({
          width: "70vw",
          height: "40vh", // Values for desktop
        });
      } else {
        setMapContainerStyle({
          width: "100vw",
          height: "30vh", // Default values for mobile
        });
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    //Causing Destroy error

    // return () => {
    //   window.removeEventListener("resize", handleResize);
    // };
  }, []);

  const onLoad = React.useCallback(
    function callback(map) {
      map.controls[window.google.maps.ControlPosition.TOP_LEFT].push(
        document.getElementById("custom-location-control")
      );
      setMap(map);
    },
    [setMap]
  );

  const onUnmount = React.useCallback(
    function callback(map) {
      setMap(null);
    },
    [setMap]
  );

  const panToLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setPlaces(null);
          setDisplayedPlaces(null);
          map.setCenter(pos);
          setMapSettings({
            ...mapSettings,
            centerMarkerLatLng: pos,
          });
        },
        () => {
          console.log("Location not available");
        }
      );
    }
    // map.setCenter(places[0].geometry.location);
    // setMapSettings({
    //   ...mapSettings,
    //   centerMarkerLatLng: {
    //     lat: places[0].geometry.location.lat(),
    //     lng: places[0].geometry.location.lng(),
    //   },
  };

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          gestureHandling: "greedy",
        }}
      >
        {/* Center Marker */}
        {mapSettings.centerMarkerLatLng && (
          <Marker
            position={mapSettings.centerMarkerLatLng}
            draggable={true}
            zIndex={1000}
            onDragEnd={(e) => {
              setMapSettings({
                ...mapSettings,
                centerMarkerLatLng: {
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                },
              });
            }}
            options={
              //  Yellow Marker icon  Scaled up
              {
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 6,
                  fillColor: "rgb(66,131,240)",
                  fillOpacity: 1,
                  strokeWeight: 0,
                },
              }
            }
          />
        )}
        {mapSettings.radius &&
          mapSettings.centerMarkerLatLng && ( // Add a radius circle if the centerMarkerLatLng is set
            <Circle
              center={mapSettings.centerMarkerLatLng}
              radius={mapSettings.radius}
              options={{
                strokeColor: "rgb(66,131,240)",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "rgb(66,131,240)",
                fillOpacity: 0.35,
                clickable: false,
                draggable: false,
                editable: false,
                visible: true,
                zIndex: 1,
              }}
            />
          )}
        {/* Places Markers */}
        {places &&
          places.map((place) => (
            <Marker
              key={place.place_id + "m"}
              position={place.geometry.location}
              onClick={(e) => {
                setSelectedPlace(place);
              }}
            />
          ))}

        {/* InfoWindow for Selected Place */}
        {selectedPlace && (
          <InfoWindow
            position={selectedPlace.geometry.location}
            onCloseClick={() => {
              setSelectedPlace(null);
            }}
          >
            <div>
              <h3>{selectedPlace.name}</h3>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      <button
        id="custom-location-control"
        className={map ? "visible-button" : "hidden"}
        onClick={panToLocation}
      >
        <FaLocationCrosshairs className="location-icon" />
      </button>
    </div>
  );
}

export default Map;
