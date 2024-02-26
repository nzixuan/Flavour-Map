import { Input } from "antd";
import React from "react";
import { StandaloneSearchBox } from "@react-google-maps/api";
import { defaultBounds } from "../constants";

function LocationSearchBox({
  searchBox,
  setSearchBox,
  map,
  mapSettings,
  setMapSettings,
  setPlaces,
}) {
  const onPlacesChanged = () => {
    console.log(searchBox?.state);
    if (searchBox === null) {
      console.log("SearchBox is null");
      return;
    }
    const places = searchBox.getPlaces();
    console.log(searchBox.getPlaces().length, searchBox.getPlaces());

    if (places.length === 0) {
      // Add notifications
      return console.log("No places found");
    }
    if (places.length === 1) {
      if (places[0].geometry.viewport) {
        map.fitBounds(places[0].geometry.viewport);
      } else {
        map.setCenter(places[0].geometry.location);
      }
      setMapSettings({
        ...mapSettings,
        centerMarkerLatLng: {
          lat: places[0].geometry.location.lat(),
          lng: places[0].geometry.location.lng(),
        },
      });
      setPlaces(null);
    } else {
      setMapSettings({ ...mapSettings, centerMarkerLatLng: null });
      const bounds = new window.google.maps.LatLngBounds();
      for (let i = 0; i < places.length; i++) {
        if (places[i].geometry.viewport) {
          bounds.union(places[i].geometry.viewport);
        } else {
          bounds.extend(places[i].geometry.location);
        }
      }
      map.fitBounds(bounds);
      setPlaces(searchBox.getPlaces());
    }
  };

  const onLoad = React.useCallback(
    function callback(searchBox) {
      setSearchBox(searchBox);
    },
    [setSearchBox]
  );
  return (
    map && (
      <StandaloneSearchBox
        onLoad={onLoad}
        onPlacesChanged={onPlacesChanged}
        bounds={map?.getBounds() || defaultBounds}
      >
        <Input placeholder="Input Location" type="text" allowClear></Input>
        {/* <input
          type="text"
          placeholder="Customized your placeholder"
          //   style={{
          //     boxSizing: `border-box`,
          //     border: `1px solid transparent`,
          //     width: `240px`,
          //     height: `32px`,
          //     padding: `0 12px`,
          //     borderRadius: `3px`,
          //     boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          //     fontSize: `14px`,
          //     outline: `none`,
          //     textOverflow: `ellipses`,
          //     position: "absolute",
          //     left: "50%",
          //     marginLeft: "-120px",
          //   }}
        /> */}
      </StandaloneSearchBox>
    )
  );
}

export default LocationSearchBox;
