import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StyledAddSectionButton from "./AddSectionButton.style";

type AddSectionButtonProps = {
  onClick?: () => void;
};

const AddSectionButton: FC<AddSectionButtonProps> = (props) => {
  return (
    <StyledAddSectionButton onClick={props.onClick}>
      <FontAwesomeIcon icon={faPlus} fixedWidth />
    </StyledAddSectionButton>
  );
};

export default AddSectionButton;
