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
  const [places, setPlaces] = React.useState([]);
  const [searchBox, setSearchBox] = React.useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapSettings, setMapSettings] = useState({ centerMarker: null });

  const placeScore = (place) => {
    return place && place.rating && place.user_ratings_total
      ? (place.rating * Math.log(place.user_ratings_total + 1)) / Math.log(6)
      : 0;
  };

  useEffect(() => {
    if (map === null) {
      return;
    }
    const placesService = new window.google.maps.places.PlacesService(map);
    if (mapSettings.centerMarker !== null) {
      placesService.nearbySearch(
        {
          rankBy: window.google.maps.places.RankBy.PROMINENCE,
          // keyword: "food",
          type: "restaurant",

          location: mapSettings.centerMarker.geometry.location,
          radius: 500,
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        },
        (results, status, pagination) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setPlaces((prevPlaces) => {
              if (
                pagination.hasNextPage &&
                (!prevPlaces || prevPlaces.length < 100)
              ) {
                pagination.nextPage();
              }

              const updatePlace = [...(prevPlaces || []), ...results]
                .filter((place) => place.business_status === "OPERATIONAL")
                .map((place) => {
                  return {
                    ...place,
                    score: placeScore(place),
                  };
                });
              updatePlace.sort((a, b) => b.score - a.score);
              return updatePlace;
            });
          } else {
            console.error(status);
          }
        }
      );
    }
  }, [map, mapSettings]);
  console.log(places?.length);
  console.log(places?.map((place) => place.name + " " + place.place_id));
  console.log(places);

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
          map={map}
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
