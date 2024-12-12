import React, { useState, useEffect } from "react";
import PhotoAlbum from "react-photo-album";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";
const ImageCollage = ({ map, place, savedPlaces, setSavedPlaces }) => {
  const [images, setImages] = useState([]);
  const [index, setIndex] = useState(-1);

  async function getPhotos() {
    if (!(place && map)) return;
    const matchingPlace = savedPlaces?.find(
      (savedPlace) => savedPlace.place_id === place?.place_id
    );
    if (matchingPlace) {
      console.log("Getting old photo");
      setImages(matchingPlace.savedPhotos);
    } else {
      console.log("Getting new photo");

      const { Place } = await window.google.maps.importLibrary("places");
      const p = new Place({
        id: place.place_id,
      });
      await p?.fetchFields({ fields: ["photos"] });
      if (p?.photos?.length > 0) {
        const images = p?.photos
          ?.slice(0, Math.min(3, p?.photos?.length))
          .map((photo) => {
            return {
              src: photo.getURI(),
              width: photo.widthPx,
              height: photo.heightPx,
            };
          });
        setSavedPlaces((prev) => [
          ...savedPlaces,
          { place_id: place.place_id, savedPhotos: images },
        ]);
        setImages(images);
      } else {
        setImages([{ src: "./placeholder.png" }]);
      }
    }
  }
  useEffect(() => {
    getPhotos();
  }, []);
  return images && images.length > 0 ? (
    <div
      style={{
        width: "100%",
        height: "auto",
      }}
    >
      <PhotoAlbum
        // layout="rows"
        layout="columns"
        columns={(containerWidth) => {
          if (containerWidth < 500) return 2;
          return 3;
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
    </div>
  ) : (
    <div></div>
  );
};

export default ImageCollage;
