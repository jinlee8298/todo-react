import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FC, MouseEventHandler } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StyledAddSectionButton from "./AddSectionButton.style";

type AddSectionButtonProps = {
  onClick?: MouseEventHandler;
};

const AddSectionButton: FC<AddSectionButtonProps> = (props) => {
  return (
    <StyledAddSectionButton onClick={props.onClick}>
      <FontAwesomeIcon icon={faPlus} fixedWidth />
    </StyledAddSectionButton>
  );
};

export default AddSectionButton;
