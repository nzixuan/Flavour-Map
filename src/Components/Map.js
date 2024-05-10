import { GoogleMap, Marker, Circle } from "@react-google-maps/api";
import { useEffect, useState } from "react";

import { InfoWindow } from "@react-google-maps/api";
import React from "react";
import { defaultCenter } from "../constants";

function Map({
  setMap,
  setMapSettings,
  mapSettings,
  places,
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

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
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
              centerMarkerLatLng: { lat: e.latLng.lat(), lng: e.latLng.lng() },
            });
          }}
          options={
            //  Yellow Marker icon  Scaled up
            {
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "yellow",
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
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#FF0000",
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
  );
}

export default Map;
