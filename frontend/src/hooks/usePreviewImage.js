import { useState } from "react";
import useShowToast from "./useShowToast.js";

const usePreviewImage = () => {
  const [imgUrl, setImgUrl] = useState(null);
  const showToast = useShowToast();

  //JAVASCRIPT FILE API
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    //CHECKS IF THE SELECTED FILE IS AN IMAGE BY VERIFYING IF ITS TYPE STARTS WITH IMAGE//

    if (file && file.type.startsWith("image/")) {
      //IF ITS  AN IMAGE A NEW FILE READER OBJECT..
      const reader = new FileReader();
      //SET UP ONLOADEND EVENT HANDLER FOR READER WHICH TRIGGERS WHEN THE FILE READING OPERATION IS COMPLETED
      reader.onloadend = () => {
        setImgUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      showToast("Invalid file Type", "Please selece and image file", "error");
      setImgUrl(null);
    }
  };

  return { handleImageChange, imgUrl };
};

export default usePreviewImage;
