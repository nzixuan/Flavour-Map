import "./PlaceCard.css";
import React from "react";
import { Image, Card, Row, Col } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import ImageCollage from "./ImageCollage";
const { Meta } = Card;

const PlaceCard = ({ map, place }) => {
  return (
    <Card
      style={{ width: "100%", marginTop: "0.5rem" }}
      // actions={[<EllipsisOutlined key="ellipsis" />]}
    >
      <Row justify="space-between">
        <Col xs={10} md={8}>
          <Row justify="center">
            <div
              style={{
                height: "15rem",
                overflow: "hidden",
              }}
            >
              <Image
                alt={place.name}
                style={{
                  height: "15rem",
                  objectFit: "cover",
                  borderRadius: "5px",
                }}
                src={
                  place?.photos?.length > 0
                    ? place?.photos[0].getUrl()
                    : "./placeholder.png"
                }
                preview={
                  place?.photos?.length > 0
                    ? {
                        imageRender: () => {
                          return (
                            <div
                              style={{
                                width: "80vw",
                                height: "80vh",
                              }}
                            >
                              <ImageCollage map={map} id={place.place_id} />
                            </div>
                          );
                        },
                        toolbarRender: () => null,
                      }
                    : false
                }
              />
            </div>
          </Row>
        </Col>
        <Col xs={13} md={15}>
          <Meta style={{ paddingTop: "1rem" }} title={place.name} />
          <p>{place.formatted_address}</p>
          <p>Rating: {place.rating}</p>
          <p>{place.user_ratings_total}</p>
          <p>{place.price_level}</p>
          <p>{place.types.join(", ")}</p>
        </Col>
        {/* <Col span={2}>
          <EllipsisOutlined key="ellipsis" />
        </Col> */}
      </Row>
      {/* <ImageCollage map={map} id={place.place_id} /> */}
    </Card>
  );
};

//     "formatted_address": "#02-171 Queen's Rd, Blk 3 Block 3, Singapore 260003",
//     "business_status": "OPERATIONAL",
//     "name": "Food R Us",
//     "opening_hours": {
//         "open_now": true
//     },
//     "price_level": 2,
//     "rating": 4.2,
//     "types": [
//         "restaurant",
//         "food",
//         "point_of_interest",
//         "establishment"
//     ],

//     "user_ratings_total": 543,
//     "place_id": "ChIJIQeGbAYa2jERrPcqCPAHZcc",
//     "reference": "ChIJIQeGbAYa2jERrPcqCPAHZcc",
// {
//     "business_status": "OPERATIONAL",
//     "formatted_address": "#02-171 Queen's Rd, Blk 3 Block 3, Singapore 260003",
//     "geometry": {
//         "location": {
//             "lat": 1.318195,
//             "lng": 103.8077213
//         },
//         "viewport": {
//             "south": 1.316965970107278,
//             "west": 103.8064491701073,
//             "north": 1.319665629892722,
//             "east": 103.8091488298927
//         }
//     },
//     "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/restaurant-71.png",
//     "icon_background_color": "#FF9E67",
//     "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/restaurant_pinlet",
//     "name": "Food R Us",
//     "opening_hours": {
//         "open_now": true
//     },
//     "photos": [
//         {
//             "height": 3024,
//             "html_attributions": [
//                 "<a href=\"https://maps.google.com/maps/contrib/106776791389471863496\">Alex Tay</a>"
//             ],
//             "width": 4032
//         }
//     ],
//     "place_id": "ChIJIQeGbAYa2jERrPcqCPAHZcc",
//     "plus_code": {
//         "compound_code": "8R95+73 Singapore",
//         "global_code": "6PH58R95+73"
//     },
//     "price_level": 2,
//     "rating": 4.2,
//     "reference": "ChIJIQeGbAYa2jERrPcqCPAHZcc",
//     "types": [
//         "restaurant",
//         "food",
//         "point_of_interest",
//         "establishment"
//     ],
//     "user_ratings_total": 543,
//     "html_attributions": []
// }
export default PlaceCard;
