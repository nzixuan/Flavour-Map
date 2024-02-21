import "./App.css";

import { Content, Footer, Header } from "antd/es/layout/layout";
import { Flex, Layout } from "antd";
import { GOOGLE_MAPS_LIBRARIES } from "./constants";
import LocationSearchBox from "./Components/LocationSearchBox";
import Map from "./Components/Map";
import React, { useEffect } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";
import CardContainer from "./Components/CardContainer";

function App() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const [map, setMap] = React.useState(null);
  const [places, setPlaces] = React.useState(null);
  const [searchBox, setSearchBox] = React.useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapSettings, setMapSettings] = useState({ centerMarker: null });

  useEffect(() => {
    if (map === null) {
      return;
    }
    const placesService = new window.google.maps.places.PlacesService(map);
    if (mapSettings.centerMarker !== null) {
      placesService.nearbySearch(
        {
          location: mapSettings.centerMarker.geometry.location,
          radius: 1500,
          type: "restaurant",
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        },
        (results, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            console.log(results);
            setPlaces(results);
          } else {
            console.error(status);
          }
        }
      );
    }
  }, [map, mapSettings]);

  return isLoaded ? (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "20px",
        }}
      >
        <LocationSearchBox
          searchBox={searchBox}
          setSearchBox={setSearchBox}
          map={map}
          mapSettings={mapSettings}
          setMapSettings={setMapSettings}
          setPlaces={setPlaces}
        ></LocationSearchBox>
      </Header>
      <Content style={{ overflow: "auto" }}>
        {/* <div style={{ position: "sticky", top: "0", zIndex: 100 }}> */}
        <Flex justify="center">
          <Map
            map={map}
            setMap={setMap}
            mapSettings={mapSettings}
            places={places}
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
          ></Map>
        </Flex>
        {/* </div> */}
        <CardContainer
          places={places}
          selectedPlace={selectedPlace}
        ></CardContainer>
      </Content>
      <Footer>Created By Ng Zi Xuan</Footer>
    </Layout>
  ) : (
    <div>
      <h1>Map Loading...</h1>
    </div>
  );
}

export default App;
