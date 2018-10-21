import React from "react";

import Footer from "./Footer/FooterContainer";
import "../App.scss";
import "./ManagedElections.scss";

export const ErrorPage = () => (
  <div>
    <h1 className="Page__Title">Error, please try again</h1>
    <p className="Page__Lead">
      We did not recognize that QR code, please try again.
    </p>
    <Footer from="/options" fromLabel="Try again" />
  </div>
);
