import StyledModal from "./TaskDetailsModal.style";
import { Button, Checkbox, Tabs } from "common/components";
import {
  FC,
  useState,
  memo,
  useEffect,
  FormEventHandler,
  KeyboardEventHandler,
  useCallback,
} from "react";
import {
  faCircle,
  faEllipsisH,
  faList,
  faTag,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TaskEditor from "../TaskEditor/TaskEditor";
import SubTasksTab from "./SubTasksTab/SubTasksTab";
import CommentsTab from "./CommentsTab/CommentsTab";
import { EntityId } from "@reduxjs/toolkit";
import { taskSelector, updateTask } from "features/taskBoard/taskBoardSlice";
import { useConfirmDialog, useDispatch, useSelector } from "common/hooks";
import { ConfirmDialog } from "common/components";
import TaskPrioritySelect from "../TaskEditor/TaskPrioritySelect/TaskPrioritySelect";
import { SelectItem } from "common/components/Select/SelectItem/SelectItem";
import { TaskPriority } from "features/taskBoard/types";

type TaskDetailsModalProps = {
  isShown: boolean;
  taskId: EntityId;
  handleClose?: () => void;
};

const TaskDetailsModal: FC<TaskDetailsModalProps> = memo(
  ({ isShown, taskId, handleClose }) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const task = useSelector((state) =>
      taskSelector.selectById(state.taskBoard, taskId)
    );
    const [showConfirm, closeConfirm, dialogProps] = useConfirmDialog();
    const dispatch = useDispatch();

    useEffect(() => {
      if (!isShown) {
        setIsEdit(false);
      }
    }, [isShown]);

    const toggleEdit = () => {
      setIsEdit((v) => !v);
    };

    const onTickCheckbox: FormEventHandler<HTMLInputElement> = (e) => {
      if (task) {
        dispatch(
          updateTask({
            id: task.id,
            changes: { finished: !task.finished },
          })
        );
      }
    };
    const onCloseModal = useCallback(() => {
      if (isEdit) {
        showConfirm({
          title: "Dicard changes?",
          message: "The changes you've made won't be saved",
          acceptButtonLabel: "Discard",
          rejectButtonLabel: "Cancel",
          onConfirm: () => {
            closeConfirm();
            handleClose?.();
          },
          backdropClick: closeConfirm,
          onEsc: closeConfirm,
          onReject: closeConfirm,
        });
      } else {
        handleClose?.();
      }
    }, [showConfirm, closeConfirm, handleClose, isEdit]);

    const onEscape: KeyboardEventHandler = useCallback(
      (e) => {
        if (e.key === "Escape") {
          onCloseModal();
        }
      },
      [onCloseModal]
    );

    const onKeyPressEditable: KeyboardEventHandler = (e) => {
      if (e.key === "Space" || e.key === "Enter" || e.key === "NumpadEnter") {
        toggleEdit();
      }
    };

    const onSelectPriority = (e: SelectItem) => {
      if (task) {
        dispatch(
          updateTask({
            id: task.id,
            changes: { priority: e.value as TaskPriority },
          })
        );
      }
    };

    return (
      <StyledModal
        onKeyDown={onEscape}
        backdropClick={onCloseModal}
        isShown={isShown}
      >
        <div className="header">
          <a href="/">
            <FontAwesomeIcon icon={faCircle} />
            To some project
          </a>
          <Button
            icon={faTimes}
            alternative={"reverse"}
            size="sx"
            rounded
            onClick={onCloseModal}
          />
        </div>
        <div className="edit-task">
          {isEdit ? (
            <TaskEditor
              task={task}
              mode="edit"
              onCancel={toggleEdit}
            ></TaskEditor>
          ) : (
            <>
              <div className="task-details">
                <Checkbox
                  checked={task?.finished ?? false}
                  onChange={onTickCheckbox}
                />
                <div
                  className="editable"
                  tabIndex={0}
                  onKeyPress={onKeyPressEditable}
                  onClick={toggleEdit}
                >
                  <h4>{task?.title}</h4>
                  <p>{task?.description}</p>
                </div>
              </div>
              <div className="task-actions">
                <Button icon={faList} alternative="reverse" size="sx" />
                <Button icon={faTag} alternative="reverse" size="sx" />
                <TaskPrioritySelect
                  onSelect={onSelectPriority}
                  taskId={task?.id}
                />
                <Button icon={faEllipsisH} alternative="reverse" size="sx" />
              </div>
            </>
          )}
        </div>
        <Tabs renderActiveTabPanelOnly>
          <Tabs.Tab
            id="Sub-tasks"
            title="Sub-tasks"
            content={<SubTasksTab parentTaskId={taskId} />}
          />
          <Tabs.Tab
            id="Comments"
            title="Comments"
            content={<CommentsTab taskId={taskId} />}
          />
        </Tabs>
        <ConfirmDialog {...dialogProps} />
      </StyledModal>
    );
  }
);

export default TaskDetailsModal;
