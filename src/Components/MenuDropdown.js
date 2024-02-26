import React from "react";
import { Dropdown, Menu } from "antd";
// import "../../node_modules/antd/dist/antd.css";

function MenuDropdown({ mapSettings, setMapSettings }) {
  const options = ["bakery", "bar", "cafe", "restaurant", "tourist_attraction"];

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
          click here <i className="fa fa-caret-down"></i>
        </a>
      </Dropdown>
    </div>
  );
}

export default MenuDropdown;
