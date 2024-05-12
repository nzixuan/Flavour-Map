import "./App.css";
import "antd/dist/reset.css";

import { Content, Footer, Header } from "antd/es/layout/layout";
import { Flex, Layout, Slider, Button, Row, Col, Typography } from "antd";
import { GOOGLE_MAPS_LIBRARIES } from "./constants";
import LocationSearchBox from "./Components/LocationSearchBox";
import Map from "./Components/Map";
import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";
import CardContainer from "./Components/CardContainer";
import MenuDropdown from "./Components/MenuDropdown";

function App() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });
  const { Text, Link } = Typography;

  const [map, setMap] = React.useState(null);
  const [places, setPlaces] = React.useState([]);
  const [searchBox, setSearchBox] = React.useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapSettings, setMapSettings] = useState({
    centerMarkerLatLng: null,
    radius: 1000,
    foodType: "restaurant",
  });
  const [placesLoading, setPlacesLoading] = useState(false);
  const [displayedPlaces, setDisplayedPlaces] = useState(null);

  const placeScore = (place) => {
    return place && place.rating && place.user_ratings_total
      ? place.rating * Math.log(place.user_ratings_total + 1)
      : 0;
  };
  const search = () => {
    if (map === null) {
      return;
    }
    const placesService = new window.google.maps.places.PlacesService(map);
    if (mapSettings.centerMarkerLatLng !== null) {
      setPlacesLoading(true);
      setPlaces(null);
      setDisplayedPlaces(null);
      // console.log(mapSettings.centerMarkerLatLng);
      placesService.nearbySearch(
        {
          rankBy: window.google.maps.places.RankBy.PROMINENCE,
          // keyword: "food",
          type: mapSettings.foodType,
          location: mapSettings.centerMarkerLatLng,
          radius: mapSettings.radius,
          key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        },
        (results, status, pagination) => {
          console.log("Nearby search API Called");
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setPlaces((prevPlaces) => {
              if (
                pagination.hasNextPage &&
                (!prevPlaces || prevPlaces.length < 10)
              ) {
                pagination.nextPage();
              } else {
                setPlacesLoading(false);
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
  };
  // console.log(mapSettings.radius);
  return isLoaded ? (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          height: "auto",
          padding: "0 20px",
        }}
      >
        <Row justify="space-between" align={"middle"}>
          <Col xs={13} md={8}>
            <LocationSearchBox
              searchBox={searchBox}
              setSearchBox={setSearchBox}
              map={map}
              mapSettings={mapSettings}
              setMapSettings={setMapSettings}
              setPlaces={setPlaces}
            ></LocationSearchBox>
          </Col>
          <Col xs={11} md={4}>
            <MenuDropdown
              mapSettings={mapSettings}
              setMapSettings={setMapSettings}
            />
          </Col>
          <Col xs={13} md={4}>
            <Row>
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 12 }}
              >
                Radius (m)
              </Text>
              <Slider
                min={100}
                max={20000}
                step={100}
                value={mapSettings.radius}
                onChange={(value) => {
                  setMapSettings({ ...mapSettings, radius: value });
                }}
                style={{ width: "100%", margin: "0 20px" }}
              ></Slider>
            </Row>
          </Col>

          <Col xs={6} md={2}>
            <Button onClick={search}>Search</Button>
          </Col>
        </Row>
      </Header>
      <Content style={{ overflow: "auto" }}>
        {/* <div style={{ position: "sticky", top: "0", zIndex: 100 }}> */}
        <Flex justify="center">
          <Map
            map={map}
            setMap={setMap}
            mapSettings={mapSettings}
            setMapSettings={setMapSettings}
            places={displayedPlaces}
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
          ></Map>
        </Flex>
        {/* </div> */}
        <CardContainer
          map={map}
          places={places}
          selectedPlace={selectedPlace}
          placesLoading={placesLoading}
          displayedPlaces={displayedPlaces}
          setDisplayedPlaces={setDisplayedPlaces}
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
