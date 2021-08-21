import StyledCheckbox from "./Checkbox.style";
import { DetailedHTMLProps, FC, MouseEventHandler } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const Checkbox: FC<
  DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
> = ({ children, ...rest }) => {
  const stopPropagation: MouseEventHandler<HTMLLabelElement> = (e) => {
    e.stopPropagation();
  };

  return (
    <StyledCheckbox onClick={stopPropagation}>
      <input type="checkbox" {...rest} />
      <span className="decoration">
        <FontAwesomeIcon icon={faCheck} />
      </span>
      {children && <span className="label">{children}</span>}
    </StyledCheckbox>
  );
};

export default Checkbox;
