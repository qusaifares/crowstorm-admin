import { render } from "react-dom";

const getBase64 = (file: File | null | undefined, cb: CallableFunction) => {
  let reader = new FileReader();
  if (!file) return;
  reader.readAsDataURL(file);
  let result;
  reader.onload = () => {
    cb(reader.result);
  };
  reader.onerror = (error) => {
    console.log("Error: ", error);
  };
};

export default getBase64;
