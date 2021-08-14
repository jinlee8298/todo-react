import StyledLabel from "./Label.style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FC } from "react";

type LabelProps = {
  icon?: IconProp;
  color?: string;
  title?: string;
};

const Label: FC<LabelProps> = (props) => {
  return (
    <StyledLabel title={props.title} color={props.color}>
      {props.icon && <FontAwesomeIcon icon={props.icon}></FontAwesomeIcon>}
      {props.children}
    </StyledLabel>
  );
};

export default Label;
