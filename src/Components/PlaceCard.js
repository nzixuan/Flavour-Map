import "./PlaceCard.css";
import React from "react";
import { Card, Row, Col } from "antd";
import ImageCollage from "./ImageCollage";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { BsDot } from "react-icons/bs";
import { FaExternalLinkAlt } from "react-icons/fa";

const { Meta } = Card;

function convertPriceLevel(priceLevel) {
  const dollarSign = "$";
  if (priceLevel) return dollarSign.repeat(priceLevel);
  return "";
}
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const stars = [];

  // Push full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(<IoIosStar key={i} />);
  }

  // Push half star if applicable
  if (hasHalfStar) {
    stars.push(<IoIosStarHalf key={fullStars} />);
  }

  // Push empty stars to make up total 5 stars
  const totalStars = 5; // Ceil to ensure 5 stars in total
  for (let i = stars.length; i < totalStars; i++) {
    stars.push(<IoIosStarOutline key={i} />);
  }

  return stars;
}

const PlaceCard = ({ map, place, savedPlaces, setSavedPlaces }) => {
  // console.log(place);
  return (
    <Card
      style={{ width: "100%", marginTop: "0.5rem", padding: "0.5rem" }}
      className="place-card"
    >
      <Row>
        <ImageCollage
          map={map}
          place={place}
          savedPlaces={savedPlaces}
          setSavedPlaces={setSavedPlaces}
        />
      </Row>
      <Row justify="space-between">
        <Col xs={24} md={15}>
          <Meta style={{ paddingTop: "1rem" }} title={place.name} />
          <p>
            {place.types
              .map((type) => {
                type = type.replace(/_/g, " ");
                type = type.charAt(0).toUpperCase() + type.slice(1);
                return type;
              })
              .join(", ")}
          </p>
          {place.rating &&
          <Row align={"middle"}>
            <p style={{ marginRight: "3px" }}>{place.rating?.toFixed(1)}</p>
            {renderStars(place.rating)}
            <p style={{ marginLeft: "3px" }}>
              {"(" + place.user_ratings_total + ")"}
            </p>

            {place.price_level && <BsDot style={{ marginLeft: "3px" }} />}
            {place.price_level && (
              <p style={{ marginLeft: "3px" }}>
                {convertPriceLevel(place.price_level)}
              </p>
            )}
          </Row>
}
          <Row align={"middle"}>
            <p>{place.formatted_address || place.vicinity}</p>
            <a
              href={
                "https://www.google.com/maps/search/?api=1&query=" +
                place.name +
                "&query_place_id=" +
                place.place_id
              }
              style={{ marginLeft: "6px" }}
            >
              <FaExternalLinkAlt />
            </a>
          </Row>
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
