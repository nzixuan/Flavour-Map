import React from "react";
import { Dropdown, Button, Space } from "antd";
import { AiFillCaretDown } from "react-icons/ai";

function MenuDropdown({ mapSettings, setMapSettings }) {
  const options = [
    "none",
    "restaurant",
    "cafe",
    "bar",
    "bakery",
    "store",
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
    <div style={{ margin: "0 20px", width: "100%" }}>
      <Dropdown menu={menuProps} placement="bottomLeft">
        <Button>
          <Space>
            {mapSettings.foodType
              ? convertTypeToString(mapSettings.foodType)
              : "Food Type"}
            <AiFillCaretDown />
          </Space>
        </Button>
      </Dropdown>
    </div>
  );
}

export default MenuDropdown;
