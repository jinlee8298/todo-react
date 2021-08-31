import StyledLabel from "./Label.style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FC } from "react";
import { Link } from "react-router-dom";

type LabelProps = {
  icon?: IconProp;
  color?: string;
  title?: string;
  to?: string;
};

const Label: FC<LabelProps> = (props) => {
  return props.to ? (
    <StyledLabel title={props.title} color={props.color}>
      <Link onClick={(e) => e.stopPropagation()} to={props.to}>
        {props.icon && <FontAwesomeIcon icon={props.icon}></FontAwesomeIcon>}
        {props.children}
      </Link>
    </StyledLabel>
  ) : (
    <StyledLabel title={props.title} color={props.color}>
      {props.icon && <FontAwesomeIcon icon={props.icon}></FontAwesomeIcon>}
      {props.children}
    </StyledLabel>
  );
};

export default Label;
