import { faTasks } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EntityId } from "@reduxjs/toolkit";
import StyledNavGroup from "./LabelNav.style";
import { NavBar } from "common/components";
import { useSelector } from "common/hooks";
import { labelSelector } from "features/taskBoard/taskBoardSlice";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Label } from "features/taskBoard/types";
import LabelEditModal from "../LabelEditModal/LabelEditModal";
import LabelMenu from "./LabelMenu/LabelMenu";

const LabelNav = () => {
  const labels = useSelector((state) =>
    labelSelector.selectAll(state.taskBoard)
  );
  const [isShownLabelModal, setIsShownLabelModal] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const history = useHistory();

  const onSelectProject = (labelId: EntityId) => {
    history.push(`/label/${labelId}`);
  };

  const onEditLabel = (label: Label) => {
    setSelectedLabel(label);
    toggleLabelModal();
  };

  const toggleLabelModal = () => {
    setIsShownLabelModal((v) => !v);
  };

  const onCloseEditModal = () => {
    setSelectedLabel(null);
    toggleLabelModal();
  };

  return (
    <StyledNavGroup
      name="Labels"
      onAddButtonClick={toggleLabelModal}
      addButtonVisible
    >
      {labels.map((label) => (
        <NavBar.NavItem
          className={"nav-item"}
          onTrigger={onSelectProject.bind(null, label.id)}
          key={label.id}
        >
          <FontAwesomeIcon icon={faTasks} color={label.color} fixedWidth />
          {label.name}
          <LabelMenu onEdit={onEditLabel.bind(null, label)} label={label} />
        </NavBar.NavItem>
      ))}
      <LabelEditModal
        onCloseHandle={onCloseEditModal}
        isShown={isShownLabelModal}
        label={selectedLabel}
      />
    </StyledNavGroup>
  );
};

export default LabelNav;
