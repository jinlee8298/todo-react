import StyledCheckbox from "./Checkbox.style";
import { DetailedHTMLProps, FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const Checkbox: FC<
  DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
> = ({ children, ...rest }) => {
  return (
    <StyledCheckbox>
      <input type="checkbox" {...rest} />
      <span className="decoration">
        <FontAwesomeIcon icon={faCheck} />
      </span>
      {children && <span className="label">{children}</span>}
    </StyledCheckbox>
  );
};

export default Checkbox;
