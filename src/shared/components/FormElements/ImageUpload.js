import React, { useRef, useState, useEffect } from "react";
import "./ImageUpload.css";
import Button from "./Button";

const ImageUpload = (props) => {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  const filePickerRef = useRef();

  //generate preview whenever we change the file state and pick a file/image
  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader(); //helps us parse files built in api obj
    //file reader loads a new file/reading is done
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result); //set the url from the fileReader after this string has been parsed
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  //generates something to help us preview that file and then forward the file to image upload comp
  //pass eventual img file to backend to dispaly data onto our user and form
  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    //get the files from the event target from the native file picker
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    //if no picked file, id, or fileIsValid set it to undefined then forward it to some parent comp
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  //opens built in file clicker to show our image picker
  //utilize the input element without seeing it thanks to refs
  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        type="file"
        ref={filePickerRef}
        id={props.id}
        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          Pick Image
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;
