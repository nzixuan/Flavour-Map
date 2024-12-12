import React from "react";
import { Dropdown, Button, Space, Row } from "antd";
import { AiFillCaretDown } from "react-icons/ai";
import {MAIN_OPTIONS, SUBMENU_OPTIONS } from "../constants";

function MenuDropdown({ mapSettings, setMapSettings }) {

  const total_options = [...MAIN_OPTIONS, ...Object.values(SUBMENU_OPTIONS).flat()];

  const convertTypeToString = (type) => {
    type = type.replace(/_/g, " ");
    type = type.charAt(0).toUpperCase() + type.slice(1);
    return type;
  };
  const handleMenuClick = (e) => {
    const selectedOption = total_options.find((option) => option === e.key);
    if (selectedOption) {
      setMapSettings({
        ...mapSettings,
        foodType: selectedOption,
      });
    }
  };

  const items = MAIN_OPTIONS.map((option) => {
    return { key: option, label: <>{convertTypeToString(option)}</> };
  });

  for (let key in SUBMENU_OPTIONS) {
    const submenu = SUBMENU_OPTIONS[key];
    const submenuItems = submenu.map((option) => {
      return { key: option, label: <>{convertTypeToString(option)}</> };
    });
    items.push({
      key: key,
      label: convertTypeToString(key),
      children: submenuItems,
    });
  }

  const menuProps = {
    items,
    onClick: handleMenuClick,
    selectable: true,
    defaultSelectedKeys: ["restaurant"],
  };

  return (
    <div style={{ width: "100%" }}>
      <Dropdown menu={menuProps} placement="bottomLeft">
        <Button style={{ width: "100%" }}>
          <Row justify={"space-between"} align={"middle"} wrap={false}>
            <p style={{width: "100%", height:'auto', textOverflow:"ellipsis", overflow:'hidden', margin:"0 0"}}>
            {mapSettings.foodType
              ? convertTypeToString(mapSettings.foodType)
              : "Food Type"}
              </p>
            <AiFillCaretDown />
          </Row>
        </Button>
      </Dropdown>
    </div>
  );
}

export default MenuDropdown;
