import "./App.css";
import "antd/dist/reset.css";

import { Content, Footer, Header } from "antd/es/layout/layout";
import {
  Flex,
  Layout,
  Slider,
  Button,
  Row,
  Col,
  Typography,
  Input,
  InputNumber,
} from "antd";
import { GOOGLE_MAPS_LIBRARIES } from "./constants";
import LocationSearchBox from "./Components/LocationSearchBox";
import Map from "./Components/Map";
import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useState } from "react";
import CardContainer from "./Components/CardContainer";
import { FaSearch } from "react-icons/fa";
import MenuDropdown from "./Components/MenuDropdown";

const marks = {
  0: {
    style: {
      color: "white",
      fontWeight: "bold",
    },
    label: "",
  },
  1: {
    style: {
      color: "white",
      fontWeight: "bold",

    },
    label: "$",
  },
  2: {
    style: {
      color: "white",
      fontWeight: "bold",

    },
    label: "$$",
  },
  3: {
    style: {
      color: "white",
      fontWeight: "bold",

    },
    label: "$$$",
  },
  4: {
    style: {
      color: "white",
      fontWeight: "bold",
    },
    label: "$$$$",
  },
};

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
    radius: 200,
    foodType: "none",
    keyword: "Food",
    priceRange: [0, 2],
  });
  const [placesLoading, setPlacesLoading] = useState(false);
  const [displayedPlaces, setDisplayedPlaces] = useState(null);

  const placeScore = (place) => {
    return place && place.rating && place.user_ratings_total
      ? place.rating * Math.log(place.user_ratings_total + 1)
      : 0;
  };

  const fitBoundsToRadius = (map, radius, center) => {
    // Convert the radius from meters to degrees
    const radiusInDegrees = radius / 111300; // Approximately 111,300 meters in one degree (latitude or longitude)

    // Calculate the bounds
    const bounds = {
      north: center.lat + radiusInDegrees,
      south: center.lat - radiusInDegrees,
      east: center.lng + radiusInDegrees,
      west: center.lng - radiusInDegrees,
    };

    // Fit the map bounds to the calculated bounds
    map.fitBounds(bounds);
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
      fitBoundsToRadius(
        map,
        mapSettings.radius,
        mapSettings.centerMarkerLatLng
      );

      // console.log(mapSettings);
      placesService.nearbySearch(
        {
          rankBy: window.google.maps.places.RankBy.PROMINENCE,
          keyword: mapSettings.keyword,
          type: mapSettings.foodType === "none" ? null : mapSettings.foodType,
          minPriceLevel: mapSettings.priceRange[0],
          maxPriceLevel: mapSettings.priceRange[1],
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

  return isLoaded ? (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          height: "auto",
          padding: "0 10px",
        }}
      >
        <Row justify="start" align={"middle"} gutter={[16,0]}>
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
          <Col xs={10} md={3}>
            <Input
              value={mapSettings.keyword}
              onChange={(e) => {
                setMapSettings({ ...mapSettings, keyword: e.target.value });
              }}
              placeholder="Keyword for search..."
            ></Input>
          </Col>
          <Col xs={14} md={4}>
            <Row align={"middle"} justify={"center"}>
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 12 }}
              >
                Radius (m)
              </Text>
              <InputNumber
                min={100}
                max={50000}
                style={{ margin: "2px 16px", width: "8ch" }}
                value={mapSettings.radius}
                onChange={(value) => {
                  setMapSettings({ ...mapSettings, radius: value });
                }}
              />
              <Slider
                min={200}
                max={5000}
                step={200}
                value={mapSettings.radius}
                onChange={(value) => {
                  setMapSettings({ ...mapSettings, radius: value });
                }}
                style={{ width: "100%", margin: "2px 20px" }}
              ></Slider>
              <div style={{height: '10px'}}></div>

            </Row>
          </Col>
          <Col xs={10} md={3}>
            <MenuDropdown
              mapSettings={mapSettings}
              setMapSettings={setMapSettings}
            />
          </Col>
          <Col xs={14} md={4} >
            <Row align={"middle"} justify={"center"}>
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 12 }}
              >
                Price Level
              </Text>
              <Slider
                marks={marks}
                range
                min={0}
                max={4}
                step={1}
                value={mapSettings.priceRange}
                tooltip={{
                  open: false,
                }}
                onChange={(value) => {
                  setMapSettings({ ...mapSettings, priceRange: value });
                }}
                style={{ width: "100%", margin: "2px 20px"}}
              ></Slider>
              <div style={{height: '20px'}}></div>
            </Row>
          </Col>

          
          <Col xs={2} md={2}>
            <Button onClick={search} icon={<FaSearch />}></Button>
          </Col>
        </Row>

      </Header>
      <Content style={{ overflow: "auto" }}>
        <Flex justify="center">
          <Map
            map={map}
            setMap={setMap}
            mapSettings={mapSettings}
            setMapSettings={setMapSettings}
            places={displayedPlaces}
            setPlaces={setPlaces}
            setDisplayedPlaces={setDisplayedPlaces}
            selectedPlace={selectedPlace}
            setSelectedPlace={setSelectedPlace}
            fitBoundsToRadius={fitBoundsToRadius}
          ></Map>
        </Flex>
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
