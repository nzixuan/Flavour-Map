import React, { useEffect, useState } from "react";
import PlaceCard from "./PlaceCard";
import { Row, Col } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { NUM_CARD_DISPLAYED } from "../constants";
const CardContainer = ({
  map,
  places,
  placesLoading,
  displayedPlaces,
  setDisplayedPlaces,
}) => {
  const [savedPlaces, setSavedPlaces] = useState([]);

  useEffect(() => {
    if (placesLoading === false)
      setDisplayedPlaces(places?.slice(0, NUM_CARD_DISPLAYED));
  }, [places, placesLoading]);

  const fetchMoreData = () => {
    console.log("Fetching more data");
    setTimeout(() => {
      setDisplayedPlaces((prev) => [
        ...prev,
        ...places?.slice(
          prev.length,
          Math.min(prev.length + NUM_CARD_DISPLAYED, places?.length)
        ),
      ]);
    }, 1500);
  };

  return (
    // Sorting and filters stuff
    <Row justify="center" align="middle" style={{ height: "100%" }}>
      <Col xs={24} sm={24} md={18} lg={16}>
        <div
          style={{ height: "90vh", width: "100%" }}
          className="card-container"
        >
          <InfiniteScroll
            dataLength={displayedPlaces?.length}
            next={fetchMoreData}
            height={"90vh"}
            hasMore={!placesLoading && displayedPlaces?.length < places?.length}
            loader={<h4>Loading...</h4>}
            scrollableTarget="card-container"
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {displayedPlaces &&
              displayedPlaces.map((place) => {
                return (
                  <PlaceCard
                    map={map}
                    key={place.place_id}
                    place={place}
                    savedPlaces={savedPlaces}
                    setSavedPlaces={setSavedPlaces}
                  />
                );
              })}
          </InfiniteScroll>
        </div>
      </Col>
    </Row>
  );
};

export default CardContainer;
