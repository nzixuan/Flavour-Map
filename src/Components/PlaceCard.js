import React from "react";
import { Card } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { Col } from "antd";
const { Meta } = Card;

const PlaceCard = ({ place }) => {
  return (
    <Col xs={24} sm={24} md={18} lg={16} style={{ marginTop: "1rem" }}>
      <Card
        style={{ width: "100%" }}
        //   cover={<img alt="example" src={place.photos[0].getUrl()} />}
        actions={[<EllipsisOutlined key="ellipsis" />]}
      >
        <Meta title={place.name} description="This is the description" />
      </Card>
    </Col>
  );
};
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