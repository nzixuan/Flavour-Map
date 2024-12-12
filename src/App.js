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
  Radio,
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

const price_style = {
  color: "white",
  fontWeight: "bold",
  fontSize: 12,
};

const marks = {
  0: {
    style: price_style,
    label: "-",
  },
  1: {
    style: price_style,
    label: "$",
  },
  2: {
    style: price_style,
    label: "$$",
  },
  3: {
    style: price_style,
    label: "$$$",
  },
  4: {
    style: price_style,
    label: "$$$$",
  },
};

function App() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const { Text } = Typography;

  const [map, setMap] = React.useState(null);
  const [placesState, setPlaces] = React.useState([]);
  const [searchBox, setSearchBox] = React.useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [mapSettings, setMapSettings] = useState({
    centerMarkerLatLng: { lat: 1.352083, lng: 103.819836 },
    radius: 400,
    foodType: "restaurant",
    keyword: "",
    priceRange: [0, 2],
    textSearchSetting: "Bias",
  });
  const [placesLoading, setPlacesLoading] = useState(false);
  const [displayedPlaces, setDisplayedPlaces] = useState(null);

  const placeScore = (place) => {
    return place && place.rating && place.user_ratings_total
      ? place.rating * Math.log(place.user_ratings_total + 1)
      : 0;
  };

  const boundsFromRadius = (center, radius) => {
    // Convert the radius from meters to degrees
    const radiusInDegrees = radius / 111300; // Approximately 111,300 meters in one degree (latitude or longitude)
    return {
      north: center.lat + radiusInDegrees,
      south: center.lat - radiusInDegrees,
      east: center.lng + radiusInDegrees,
      west: center.lng - radiusInDegrees,
    };
  };

  const fitBoundsToRadius = (map, radius, center) => {
    // Fit the map bounds to the calculated bounds
    map.fitBounds(boundsFromRadius(center, radius));
  };

  // Search Button handler
  const search = async () => {
    if (map === null) {
      return;
    }
    if (mapSettings.centerMarkerLatLng !== null) {
      setPlacesLoading(true);
      setPlaces(null);
      setDisplayedPlaces(null);

      const {
        Place,
        SearchNearbyRankPreference,
        SearchByTextRankPreference,
        PriceLevel,
      } = await window.google.maps.importLibrary("places");

      const priceLevelToEnum = {
        0: PriceLevel.FREE,
        1: PriceLevel.INEXPENSIVE,
        2: PriceLevel.MODERATE,
        3: PriceLevel.EXPENSIVE,
        4: PriceLevel.VERY_EXPENSIVE,
      };

      const enumToPriceLevel = {
        [PriceLevel.FREE]: 0,
        [PriceLevel.INEXPENSIVE]: 1,
        [PriceLevel.MODERATE]: 2,
        [PriceLevel.EXPENSIVE]: 3,
        [PriceLevel.VERY_EXPENS]: 4,
      };

      const fields = [
        "displayName",
        "businessStatus",
        "formattedAddress",
        "priceLevel",
        "rating",
        "types",
        "userRatingCount",
        "id",
        "types",
        "location",
      ];

      // Nearby Search
      let response;
      if (mapSettings.keyword === "") {
        const request = {
          fields: fields,
          locationRestriction: {
            center: mapSettings.centerMarkerLatLng,
            radius: mapSettings.radius,
          },
          includedTypes:
            mapSettings.foodType === "none" ? null : [mapSettings.foodType],
          rankPreference: SearchNearbyRankPreference.POPULARITY,
          // Debug Options
          // maxResultCount: 3,
        };

        if (mapSettings.foodType === "restaurant") {
          request.excludedTypes = ["hotel"];
        }

        const { places } = await Place.searchNearby(request);
        response = places;
        response = response.filter(
          (place) =>
            (!place.priceLevel && mapSettings.priceRange[0] === 0) ||
            (enumToPriceLevel[place.priceLevel] >= mapSettings.priceRange[0] &&
              enumToPriceLevel[place.priceLevel] <= mapSettings.priceRange[1])
        );
        fitBoundsToRadius(
          map,
          mapSettings.radius,
          mapSettings.centerMarkerLatLng
        );
      } else {
        //Text Search

        let priceLevels = [];
        for (
          let i = mapSettings.priceRange[0];
          i <= mapSettings.priceRange[1];
          i++
        ) {
          if (i === 0) {
            continue;
          }
          priceLevels.push(priceLevelToEnum[i]);
        }

        const request = {
          fields: fields,
          textQuery: mapSettings.keyword,
          rankPreference: SearchByTextRankPreference.RELEVANCE,
          includedType:
            mapSettings.foodType === "none" ? null : mapSettings.foodType,
          priceLevels: priceLevels,
          useStrictTypeFiltering: true,
          // Debug Options
          // maxResultCount: 3,
        };

        if (mapSettings.textSearchSetting === "Bias") {
          request.locationBias = {
            center: mapSettings.centerMarkerLatLng,
            radius: mapSettings.radius,
          };
        } else if (mapSettings.textSearchSetting === "Restrict") {
          request.locationRestriction = boundsFromRadius(
            mapSettings.centerMarkerLatLng,
            mapSettings.radius
          );
        }
        const { places } = await Place.searchByText(request);
        response = places;
        if (places.length > 0) {
          const bounds = new window.google.maps.LatLngBounds();
          for (let i = 0; i < places.length; i++) {
            bounds.extend(places[i]?.location);
          }
          map.fitBounds(bounds);
        }
      }

      let results = response.map((place) => {
        return {
          business_status: place.businessStatus,
          formatted_address: place.formattedAddress,
          name: place.displayName,
          price_level: enumToPriceLevel[place.priceLevel],
          rating: place.rating,
          types: place.types,
          user_ratings_total: place.userRatingCount,
          place_id: place.id,
          location: place.location,
        };
      });

      results = results
        .filter((place) => place.business_status === "OPERATIONAL")
        .map((place) => {
          return {
            ...place,
            score: placeScore(place),
          };
        });

      setPlaces((prevPlaces) => {
        setPlacesLoading(false);
        const updatePlace = [...(prevPlaces || []), ...results];
        updatePlace.sort((a, b) => b.score - a.score);
        return updatePlace;
      });
    }
  };

  return isLoaded ? (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          height: "auto",
          padding: "10px 10px",
        }}
      >
        {/* Navigation Bar */}
        <Row justify="start" align={"middle"} gutter={[16, 0]}>
          {/* Location Search Box */}
          <Col xs={13} md={6}>
            <LocationSearchBox
              searchBox={searchBox}
              setSearchBox={setSearchBox}
              map={map}
              mapSettings={mapSettings}
              setMapSettings={setMapSettings}
              setPlaces={setPlaces}
            ></LocationSearchBox>
          </Col>
          {/* Radius Slider */}
          <Col xs={11} md={4}>
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
                max={2000}
                step={200}
                tooltip={{
                  open: false,
                }}
                value={mapSettings.radius}
                onChange={(value) => {
                  setMapSettings({ ...mapSettings, radius: value });
                }}
                style={{ width: "100%", margin: "2px 8px" }}
              ></Slider>
              <div style={{ height: "10px" }}></div>
            </Row>
          </Col>
          {/* Type Filter Dropdown*/}
          <Col xs={10} md={3}>
            <MenuDropdown
              mapSettings={mapSettings}
              setMapSettings={setMapSettings}
            />
          </Col>
          {/* Keyword Search */}
          <Col xs={14} md={4}>
            <Input
              value={mapSettings.keyword}
              onChange={(e) => {
                setMapSettings({ ...mapSettings, keyword: e.target.value });
              }}
              placeholder="Keyword for search..."
            ></Input>
          </Col>

          {/* Price Slider */}
          <Col xs={11} md={3}>
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
                style={{ width: "100%", margin: "2px 8px" }}
              ></Slider>
              <div style={{ height: "20px" }}></div>
            </Row>
          </Col>
          {/* Bias/Restrict Toggle */}
          <Col xs={10} md={3}>
            <Radio.Group
              block
              options={[
                { label: "Bias", value: "Bias" },
                { label: "Restrict", value: "Restrict" },
              ]}
              value={mapSettings.textSearchSetting}
              onChange={(e) => {
                setMapSettings({
                  ...mapSettings,
                  textSearchSetting: e.target.value,
                });
              }}
              disabled={mapSettings.keyword === ""}
              optionType="button"
              buttonStyle="solid"
            />
          </Col>
          {/* Search Button */}
          <Col xs={2} md={1}>
            <Button onClick={search} icon={<FaSearch />}></Button>
          </Col>
        </Row>
      </Header>
      {/* Main Content */}
      <Content style={{ overflow: "auto" }}>
        {/* Map */}
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
        {/* Cards Container */}
        <CardContainer
          map={map}
          places={placesState}
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
