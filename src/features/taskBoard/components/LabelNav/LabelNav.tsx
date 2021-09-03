import { faTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EntityId } from "@reduxjs/toolkit";
import StyledNavGroup from "./LabelNav.style";
import { NavBar } from "common/components";
import { useSelector } from "common/hooks";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Label } from "features/taskBoard/types";
import LabelEditModal from "../LabelEditModal/LabelEditModal";
import LabelMenu from "./LabelMenu";
import { labelSelector } from "features/taskBoard/store/labelReducer";

const LabelNav = () => {
  const labels = useSelector((state) =>
    labelSelector.selectAll(state.taskBoard)
  );
  const [isShownLabelModal, setIsShownLabelModal] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const match = useRouteMatch<{ id: string }>("/label/:id");
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
      addButtonTitle="Add new label"
      name="Labels"
      onAddButtonClick={toggleLabelModal}
      addButtonVisible
      expandByDefault
    >
      {labels.map((label) => (
        <NavBar.NavItem
          active={label.id === match?.params.id}
          className={"nav-item"}
          onTrigger={onSelectProject.bind(null, label.id)}
          key={label.id}
        >
          <FontAwesomeIcon icon={faTag} color={label.color} fixedWidth />
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
