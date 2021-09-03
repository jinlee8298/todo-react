import { Button, Select } from "common/components";
import { useDispatch, useSelector } from "common/hooks";
import { projectSelector } from "features/taskBoard/store/projectReducer";
import { sectionSelector } from "features/taskBoard/store/sectionReducer";
import { SelectItem } from "common/components/Select/SelectItem/SelectItem";
import { FC, useMemo, useState } from "react";
import { faList, faSitemap } from "@fortawesome/free-solid-svg-icons";
import { Task } from "features/taskBoard/types";
import { moveTask } from "features/taskBoard/taskBoardSlice";

type TaskSectionSelectProps = {
  task: Task;
  disabled?: boolean;
};

const TaskSectionSelect: FC<TaskSectionSelectProps> = ({ task, disabled }) => {
  const projects = useSelector((state) =>
    projectSelector.selectAll(state.taskBoard)
  );
  const [selected, setSelected] = useState<SelectItem>();
  const sectionEntries = useSelector((state) =>
    sectionSelector.selectEntities(state.taskBoard)
  );
  const dispatch = useDispatch();

  const selectItems = useMemo(() => {
    const items: SelectItem[] = [];
    projects.forEach((project) => {
      if (project.sectionIds.length > 0) {
        items.push({
          label: `Project: ${project.name}`,
          value: project.name,
          isGroupLabel: true,
        });
        project.sectionIds.forEach((sectionId) => {
          const section = sectionEntries[sectionId];
          section &&
            items.push({
              label: section.name,
              icon: faSitemap,
              iconColor: project.color,
              value: `${project.id},${section.id}`,
            });
        });
      }
    });
    return items;
  }, [projects, sectionEntries]);

  const onOpen = () => {
    if (task) {
      console.log(`${task.projectId},${task.sectionId}`);
      const taskSection = sectionEntries[task.sectionId];
      taskSection &&
        setSelected({
          label: taskSection.name,
          value: `${task.projectId},${task.sectionId}`,
        });
    }
  };

  const onSelect = (selectItem: SelectItem) => {
    setSelected(selectItem);
  };

  const onClose = () => {
    if (selected && task) {
      // selected.value have value with template: `${projectId},${sectionId}`
      const [projectId, sectionId] = selected.value.split(",");
      if (sectionId !== task.sectionId) {
        dispatch(moveTask(projectId, sectionId, task.id));
      }
    }
  };

  return (
    <Select
      selected={selected}
      onSelect={onSelect}
      onOpen={onOpen}
      onClose={onClose}
      items={selectItems}
    >
      <Button
        disabled={disabled}
        aria-label="Move to another section"
        size="sx"
        icon={faList}
        title="Move to another section"
        alternative="reverse"
      />
    </Select>
  );
};

export default TaskSectionSelect;
