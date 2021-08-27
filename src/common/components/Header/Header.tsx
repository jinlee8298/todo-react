import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import StyledHeader from "./Header.style";

type HeaderProps = {
  onToggleNavBar?: () => void;
};

const Header: FC<HeaderProps> = ({ onToggleNavBar }) => {
  return (
    <StyledHeader>
      <button onClick={onToggleNavBar} className="toggle-nav">
        <FontAwesomeIcon icon={faBars} fixedWidth />
      </button>
    </StyledHeader>
  );
};

export default Header;
