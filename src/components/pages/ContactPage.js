import React from "react";
import { Helmet } from "react-helmet";

const ContactPage = () => {
  return (
    <div className="contact-page">
      <Helmet>
        <title>聯絡我們 Coming Soon ...</title>
        <link rel="icon" href={`${process.env.PUBLIC_URL}/images/alien.png`} />
      </Helmet>

      <button className="shiny-cta">
        <span>Coming Soon ...</span>
      </button>
    </div>
  );
};

export default ContactPage;
