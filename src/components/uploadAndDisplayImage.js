import React, { useEffect, useState } from "react";
import { Button } from '@ui5/webcomponents-react';

const UploadAndDisplayImage = ({ selectedImage, setSelectedImage }) => {
  useEffect(() => {
    setSelectedImage(null);
},[])
  
  if (selectedImage == null) {
    return (<input
      type="file"
      name="myImage"
      onChange={(event) => {
        console.log(event.target.files[0]);
        setSelectedImage(event.target.files[0]);
      }}
    />
    );
  }
  else {
    return (
      <div>

        ] {selectedImage != null && (
          <div>
            <img
              alt="not found"
              width={"250px"}
              src={URL.createObjectURL(selectedImage)}
            />
            <br />
            <Button className="btnOthers" onClick={() => setSelectedImage(null)}>Remove</Button>
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
  }
};

export default UploadAndDisplayImage;