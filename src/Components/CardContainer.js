import React from "react";
import PlaceCard from "./PlaceCard";
import { Scrollbars } from "rc-scrollbars";
import { Row } from "antd";
const CardContainer = ({ places }) => {
  return (
    // Sorting and filters stuff
    <div style={{ height: "90vh", width: "100%" }} className="card-container">
      <Scrollbars autoHide>
        <Row justify="center" align="middle" style={{ height: "100%" }}>
          {places &&
            places.map((place) => {
              return <PlaceCard key={place.place_id} place={place} />;
            })}
        </Row>
      </Scrollbars>
    </div>
  );
};

export default CardContainer;
