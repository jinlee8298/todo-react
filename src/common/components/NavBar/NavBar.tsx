import { FC } from "react";
import StyledNav from "./NavBar.style";
import NavGroup from "./NavGroup/NavGroup";
import NavItem from "./NavItem/NavItem";

type NavBarType = FC & {
  NavGroup: typeof NavGroup;
  NavItem: typeof NavItem;
};

const NavBar: NavBarType = ({ children }) => {
  return <StyledNav>{children}</StyledNav>;
};

NavBar.NavGroup = NavGroup;
NavBar.NavItem = NavItem;

export default NavBar;
