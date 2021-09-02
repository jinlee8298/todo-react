import { faBars, faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import StyledHeader from "./Header.style";
import { FC, ReactElement, useState } from "react";
import NavBar from "../NavBar/NavBar";
import { useHistory } from "react-router-dom";

type HeaderProps = {
  navContent?: ReactElement;
};

const Header: FC<HeaderProps> = ({ navContent }) => {
  const [showNavBar, setShowNavBar] = useState(true);
  const history = useHistory();
  const onToggleNavBar = () => {
    setShowNavBar((v) => !v);
  };
  const onToHomePage = () => {
    history.push("/");
  };

  return (
    <StyledHeader className={showNavBar ? "show-nav" : ""}>
      <NavBar>{navContent}</NavBar>
      <div className="left-group">
        <button
          aria-label="Open side navigation tab"
          title="Open side navigation tab"
          onClick={onToggleNavBar}
          className="toggle-nav"
        >
          <FontAwesomeIcon icon={faBars} fixedWidth />
        </button>
        <button
          aria-label="Go to homepage"
          title="Go to homepage"
          onClick={onToHomePage}
          className="toggle-nav"
        >
          <FontAwesomeIcon icon={faHome} fixedWidth />
        </button>
      </div>
    </StyledHeader>
  );
};

export default Header;
