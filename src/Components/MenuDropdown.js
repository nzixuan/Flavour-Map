import React from "react";
import { Dropdown, Menu } from "antd";
// import "../../node_modules/antd/dist/antd.css";

function MenuDropdown({ mapSettings, setMapSettings }) {
  const options = [
    "bakery",
    "bar",
    "cafe",
    "restaurant",
    "tourist_attraction",
    "lodging",
    "gym",
    "atm",
    "convenience_store",
    "supermarket",
    "amusement_park",
    "aquarium",
    "book_store",
    "campground",
    "clothing_store",
    "department_store",
    "liquor_store",
    "museum",
    "night_club",
    "park",
    "shopping_mall",
    "spa",
  ];

  const handleMenuClick = (e) => {
    const selectedOption = options.find((option) => option === e.key);
    if (selectedOption) {
      setMapSettings({
        ...mapSettings,
        foodType: selectedOption,
      });
    }
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {options.map((option) => (
        <Menu.Item key={option}>{option}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div style={{ margin: "20px" }}>
      <Dropdown overlay={menu} placement="bottomLeft">
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          FoodTypes <i className="fa fa-caret-down"></i>
        </a>
      </Dropdown>
    </div>
  );
}

export default MenuDropdown;
