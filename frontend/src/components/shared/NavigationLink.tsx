import React from "react";
import { Link } from "react-router-dom";

type Props = {
  bg: string;
  to: string;
  text: string;
  textColor: string;
  onClick: () => Promise<void>;
};

const NavigationLink = (props: Props) => {
  return (
    <Link
      className="nav-link"
      to={props.to}
      style={{ background: props.bg, color: props.textColor }}
    >
      {props.text}
    </Link>
  );
};

export default NavigationLink;
