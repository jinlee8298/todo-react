import { FC, useEffect, useRef, useState } from "react";
import { Button, Menu, Checkbox, Label } from "common/components";
import {
  faEllipsisH,
  faEdit,
  faCopy,
  faTrash,
  faHospital,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import StyledTask from "./Task.style";
import { useMenu } from "common/hooks";

type TaskProps = {
  title: string;
  description?: string;
};

const Task: FC<TaskProps> = (props) => {
  const [showMenu, iconButtonRef, openMenu, closeMenu] =
    useMenu<HTMLButtonElement>();

  useEffect(() => {
    if (showMenu) {
      iconButtonRef.current?.classList.add("showing");
    } else {
      // 200 is transition time for menu
      setTimeout(() => {
        iconButtonRef.current?.classList.remove("showing");
      }, 200);
    }
  }, [showMenu, iconButtonRef]);

  return (
    <StyledTask draggable>
      <h3>
        <Checkbox />
        <span>{props.title}</span>
      </h3>
      {props.description && <p>{props.description}</p>}
      <div className="task-details">
        <Label icon={faHospital}>20 Aug 2022</Label>
        <Label icon={faPlus}>20 Aug 2022</Label>
      </div>
      <Button
        ref={iconButtonRef}
        size="sx"
        icon={faEllipsisH}
        onClick={openMenu}
        alternative="reverse"
        rounded
      />
      <Menu attachTo={iconButtonRef} open={showMenu} handleClose={closeMenu}>
        <Menu.Item icon={faEdit}>Edit task</Menu.Item>
        <Menu.Item icon={faCopy}>Duplicate</Menu.Item>
        <Menu.Item variant="danger" icon={faTrash}>
          Delete task
        </Menu.Item>
      </Menu>
    </StyledTask>
  );
};

export default Task;
