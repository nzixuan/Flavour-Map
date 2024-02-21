import React from "react";
import PlaceCard from "./PlaceCard";
import { Scrollbars } from "rc-scrollbars";
import { Row, Col } from "antd";
const CardContainer = ({ map, places }) => {
  return (
    // Sorting and filters stuff
    <Row justify="center" align="middle" style={{ height: "100%" }}>
      <Col xs={24} sm={24} md={18} lg={16}>
        <div
          style={{ height: "90vh", width: "100%" }}
          className="card-container"
        >
          <Scrollbars autoHide>
            {places &&
              places.map((place) => {
                return (
                  <PlaceCard map={map} key={place.place_id} place={place} />
                );
              })}
          </Scrollbars>
        </div>
      </Col>
    </Row>
  );
};

export default CardContainer;
