import {
  ComponentPropsWithoutRef,
  FC,
  forwardRef,
  KeyboardEventHandler,
} from "react";
import StyledItem from "./NavItem.style";

type NavItemProps = {
  onTrigger?: () => void;
  active?: boolean;
} & ComponentPropsWithoutRef<"li">;

const NavItem: FC<NavItemProps> = forwardRef<HTMLLIElement, NavItemProps>(
  ({ active = false, children, onTrigger, ...rest }, ref) => {
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
        className={[active ? "active" : "", rest.className].join(" ")}
      >
        {children}
      </StyledItem>
    );
  }
);

export default NavItem;
