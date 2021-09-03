import { faBars, faHome, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";
import Button from "../Button/Button";
import StyledNavModal from "./NavBar.style";
import NavGroup from "./NavGroup/NavGroup";
import NavItem from "./NavItem/NavItem";

type NavBarProps = {
  isShown: boolean;
  onClose: () => void;
};

type NavBarType = FC<NavBarProps> & {
  NavGroup: typeof NavGroup;
  NavItem: typeof NavItem;
};

const NavBar: NavBarType = ({ children, isShown, onClose }) => {
  return (
    <StyledNavModal backdropClick={onClose} isShown={isShown}>
      <div>
        <Button
          variant="white"
          title="Close navigation bar"
          aria-label="Close navigation bar"
          onClick={onClose}
          icon={faTimes}
          size="sx"
          rounded
          alternative="reverse"
        />
      </div>
      <nav>{children}</nav>
    </StyledNavModal>
  );
};

NavBar.NavGroup = NavGroup;
NavBar.NavItem = NavItem;

export default NavBar;
