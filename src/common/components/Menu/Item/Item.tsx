import StyledMenuItem from "./Item.style";
import {
  FC,
  useContext,
  MouseEventHandler,
  KeyboardEventHandler,
  TouchEventHandler,
} from "react";
import { ThemeContext } from "styled-components";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type MenuItemProps = {
  onTrigger?: () => void;
  icon?: IconProp;
  description?: string;
  variant?: "primary" | "success" | "danger" | "warning" | "info";
};

const MenuItem: FC<MenuItemProps> = (props) => {
  const themeContext = useContext(ThemeContext);

  const onClick: MouseEventHandler<HTMLLIElement> = (e) => {
    props.onTrigger?.();
  };

  const onKeyDown: KeyboardEventHandler<HTMLLIElement> = (e) => {
    if (["Space", "Enter", "NumpadEnter"].includes(e.code)) {
      e.preventDefault();
      props.onTrigger?.();
    }
  };

  return (
    <StyledMenuItem
      className={props.variant === "danger" ? "danger" : ""}
      tabIndex={1}
      onClick={onClick}
      onKeyDown={onKeyDown}
      color={themeContext[props.variant ?? "primary"]}
    >
      {props.icon && <FontAwesomeIcon icon={props.icon} fixedWidth />}
      <span>{props.children}</span>
    </StyledMenuItem>
  );
};

export default MenuItem;
