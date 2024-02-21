import React, { useState, useEffect } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Scrollbars from "rc-scrollbars";
const ImageCollage = ({ map, id }) => {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    if (id && map && images) {
      const placesService = new window.google.maps.places.PlacesService(map);
      placesService.getDetails(
        {
          placeId: id,
          fields: ["photos"],
        },
        (place, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK) {
            setImages(
              place?.photos?.map((photo) => {
                return {
                  src: photo.getUrl(),
                  width: photo.width,
                  height: photo.height,
                };
              })
            );
          }
        }
      );
    }
  }, [id, map]);

  return images && images.length > 0 ? (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Scrollbars autoHide>
        <PhotoAlbum
          layout="rows"
          // layout="masonry"
          // layout="columsns"
          targetRowHeight={300}
          columns={(containerWidth) => {
            if (containerWidth < 400) return 2;
            if (containerWidth < 800) return 3;
            if (containerWidth < 1000) return 4;
            return 5;
          }}
          photos={images}
          onClick={({ index }) => setIndex(index)}
        />
        <Lightbox
          slides={images}
          open={index >= 0}
          index={index}
          close={() => setIndex(-1)}
          plugins={[Fullscreen, Thumbnails, Zoom]}
        />
      </Scrollbars>
    </div>
  ) : (
    <div></div>
  );
};

export default ImageCollage;
