import React from "react";
import { Dropdown, Button, Space, Row } from "antd";
import { AiFillCaretDown } from "react-icons/ai";

function MenuDropdown({ mapSettings, setMapSettings }) {
  const options = [
    "none",
    "restaurant",
    "cafe",
    "bar",
    // "store",
    // "tourist_attraction",
    // "lodging",
    // "gym",
    // "night_club",
    // "shopping_mall",
    // "spa",
    // "museum",
    // "supermarket",
    // "atm",
    // "convenience_store",
    // "park",
    // "aquarium",
    // "amusement_park",
    "bakery",
    // "book_store",
    // "campground",
    // "clothing_store",
    // "department_store",
    // "liquor_store",
  ];

  const convertTypeToString = (type) => {
    type = type.replace(/_/g, " ");
    type = type.charAt(0).toUpperCase() + type.slice(1);
    return type;
  };
  const handleMenuClick = (e) => {
    const selectedOption = options.find((option) => option === e.key);
    if (selectedOption) {
      setMapSettings({
        ...mapSettings,
        foodType: selectedOption,
      });
    }
  };
  const items = options.map((option) => {
    return { key: option, label: <>{convertTypeToString(option)}</> };
  });

  const menuProps = {
    items,
    onClick: handleMenuClick,
    selectable: true,
    defaultSelectedKeys: ["restaurant"],
  };

  return (
    <div style={{ padding: "0 10px", width: "100%" }}>
      <Dropdown menu={menuProps} placement="bottomLeft">
        <Button style={{ width: "100%" }}>
          <Row justify={"space-between"} align={"middle"} wrap={false}>
            {mapSettings.foodType
              ? convertTypeToString(mapSettings.foodType)
              : "Food Type"}
            <AiFillCaretDown />
          </Row>
        </Button>
      </Dropdown>
    </div>
  );
}

export default MenuDropdown;
