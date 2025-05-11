import * as React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import ReactModal from "react-modal";
import Button from "@material-ui/core/Button";
import cancunLogo from "../../assets/cancun-logo.jpeg";
import eivLogo from "../../assets/eiv-ntes-logo.jpeg";
import ramadanLogo from "../../assets/ramadan-logo.png";

export default function Logo({ parentWidth }) {
  const pickLogo = (appOriginComp) => {
    // if (window.location.href.includes("cancun")) {
    //     return cancunLogo;
    // }
    // return eivLogo;
    return ramadanLogo;
    // return cancunLogo;
  };

  const { height } = Dimensions.get("window");
  const logoForApp = pickLogo();
  return (
    <div style={{ textAlign: "center" }}>
      <img
        style={{ maxWidth: !isNaN(parentWidth) ? parentWidth * 0.7 : "65%" }}
        src={logoForApp}
      />
    </div>
  );
}
