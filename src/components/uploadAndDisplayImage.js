import React, { useEffect, useState } from "react";
import { Button } from '@ui5/webcomponents-react';

const UploadAndDisplayImage = ({ selectedImage, setSelectedImage }) => {

  
  return (
    <div>

      {selectedImage && (
        <div>
          <img
            alt="not found"
            width={"250px"}
            src={URL.createObjectURL(selectedImage)}
          />
          <br />
          <button className="btnOthers" onClick={() => setSelectedImage(null)}>Remove</button>
        </div>
      )}

      <br />
      <br />
      
      <input
        type="file"
        name="myImage"
        onChange={(event) => {
          setSelectedImage(event.target.files[0]);
        }}
      />
    </div>
  );
};

export default UploadAndDisplayImage;