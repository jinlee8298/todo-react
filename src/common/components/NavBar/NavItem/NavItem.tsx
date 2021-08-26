import {
  ComponentPropsWithoutRef,
  FC,
  forwardRef,
  KeyboardEventHandler,
} from "react";
import StyledItem from "./NavItem.style";

type NavItemProps = {
  onTrigger?: () => void;
} & ComponentPropsWithoutRef<"li">;

const NavItem: FC<NavItemProps> = forwardRef<HTMLLIElement, NavItemProps>(
  ({ onTrigger, children, ...rest }, ref) => {
    const onKeyDown: KeyboardEventHandler = (e) => {
      if (["Enter", "Space", "NumpadEnter"].includes(e.code)) {
        onTrigger?.();
      }
    };
    return (
      <StyledItem
        tabIndex={0}
        onClick={onTrigger}
        onKeyDown={onKeyDown}
        ref={ref}
        role="link"
        {...rest}
      >
        {children}
      </StyledItem>
    );
  }
);

export default NavItem;
