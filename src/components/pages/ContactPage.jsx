import React from "react";
import { Helmet } from "react-helmet-async";

const ContactPage = () => {
  return (
    <div className="contact-page">
      <Helmet>
        <title>聯絡我們</title>
        <link rel="icon" href="/images/alien.png" />
      </Helmet>

      <a href="mailto:dyccc01@gmail.com" className="shiny-cta">
        <span>Contact Us</span>
      </a>
    </div>
  );
};

export default ContactPage;
