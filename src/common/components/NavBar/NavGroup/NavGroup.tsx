import { faChevronRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "common/components/Button/Button";
import {
  ComponentPropsWithoutRef,
  FC,
  KeyboardEventHandler,
  MouseEventHandler,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import StyledGroup from "./NavGroup.style";

type NavGroupProps = {
  name: string;
  addButtonVisible?: boolean;
  expandByDefault?: boolean;
  onAddButtonClick?: () => void;
} & ComponentPropsWithoutRef<"div">;

const NavGroup: FC<NavGroupProps> = ({
  name,
  addButtonVisible = false,
  expandByDefault = false,
  children,
  onAddButtonClick,
  ...rest
}) => {
  const [expand, setExpand] = useState(expandByDefault);
  const ulRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    if (!ulRef.current) {
      return;
    }
    if (expand) {
      const navItems = ulRef.current.querySelectorAll("li");
      if (navItems.length > 0) {
        const itemCount = navItems.length;
        const itemHeight = navItems[0].offsetHeight;
        ulRef.current.style.height = `${itemHeight * itemCount}px`;
      }
    } else {
      ulRef.current.style.height = "0";
    }
  }, [expand, children]);

  const toggleExpand = () => {
    setExpand((v) => !v);
  };

  const onPressEnter: KeyboardEventHandler = (e) => {
    if (
      ["Enter", "Space", "NumpadEnter"].includes(e.code) &&
      e.currentTarget === e.target
    ) {
      toggleExpand();
    }
  };

  const onClick: MouseEventHandler = (e) => {
    e.stopPropagation();
    onAddButtonClick?.();
  };

  return (
    <StyledGroup
      {...rest}
      className={[expand ? "expand" : "", rest.className].join(" ")}
    >
      <div
        className="group-name"
        onClick={toggleExpand}
        onKeyDown={onPressEnter}
        tabIndex={0}
      >
        <span>
          <FontAwesomeIcon fixedWidth icon={faChevronRight} />
          {name}
        </span>
        {addButtonVisible && (
          <Button
            size="sx"
            alternative="reverse"
            onClick={onClick}
            rounded
            icon={faPlus}
          />
        )}
      </div>
      <ul ref={ulRef}>{children}</ul>
    </StyledGroup>
  );
};

export default NavGroup;
