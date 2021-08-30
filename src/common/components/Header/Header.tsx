import { faBars, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StyledHeader from "./Header.style";
import { FC, ReactElement, useState } from "react";
import NavBar from "../NavBar/NavBar";

type HeaderProps = {
  navContent?: ReactElement;
};

const Header: FC<HeaderProps> = ({ navContent }) => {
  const [showNavBar, setShowNavBar] = useState(false);
  const onToggleNavBar = () => {
    setShowNavBar((v) => !v);
  };

  return (
    <StyledHeader className={showNavBar ? "show-nav" : ""}>
      <NavBar>{navContent}</NavBar>
      <div className="left-group">
        <button onClick={onToggleNavBar} className="toggle-nav">
          <FontAwesomeIcon icon={faBars} fixedWidth />
        </button>
        <button className="toggle-nav">
          <FontAwesomeIcon icon={faHome} fixedWidth />
        </button>
      </div>
    </StyledHeader>
  );
};

export default Header;
