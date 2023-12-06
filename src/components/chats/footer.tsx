import React from "react";
import { TextField } from "./TextField";
import HeaderLayout from "./HeaderLayout";

type Props = {};

function Footer({}: Props) {
  return (
    <div className=" h-16 px-4 flex items-center">
      <TextField />
    </div>
  );
}

export default Footer;
