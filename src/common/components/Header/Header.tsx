import { faBars, faHome } from "@fortawesome/free-solid-svg-icons";
import StyledHeader from "./Header.style";
import { FC, ReactElement, useState } from "react";
import NavBar from "../NavBar/NavBar";
import { useHistory } from "react-router-dom";
import Button from "../Button/Button";

type HeaderProps = {
  navContent?: ReactElement;
};

const Header: FC<HeaderProps> = ({ navContent }) => {
  const [showNavBar, setShowNavBar] = useState(false);
  const history = useHistory();
  const closeNavBar = () => {
    setShowNavBar(false);
  };

  const openNavBar = () => {
    setShowNavBar(true);
  };

  const onToHomePage = () => {
    history.push("/");
  };

  return (
    <StyledHeader className={showNavBar ? "show-nav" : ""}>
      <NavBar onClose={closeNavBar} isShown={showNavBar}>
        {navContent}
      </NavBar>
      <div className="left-group">
        <Button
          aria-label="Open side navigation tab"
          title="Open side navigation tab"
          onClick={openNavBar}
          icon={faBars}
          variant="white"
          alternative="reverse"
          size="sx"
        />
        <Button
          aria-label="Go to homepage"
          title="Go to homepage"
          onClick={onToHomePage}
          icon={faHome}
          variant="white"
          alternative="reverse"
          size="sx"
        />
      </div>
    </StyledHeader>
  );
};

export default Header;
