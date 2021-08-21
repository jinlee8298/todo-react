import StyledModal from "./TaskDetailsModal.style";
import { Button, Checkbox, Tabs } from "common/components";
import {
  FC,
  useState,
  memo,
  useEffect,
  FormEventHandler,
  KeyboardEventHandler,
} from "react";
import {
  faCircle,
  faEllipsisH,
  faFlag,
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
    const onCloseModal = () => {
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
    };

    const onEscape: KeyboardEventHandler = (e) => {
      if (e.key === "Escape") {
        onCloseModal();
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
                <div className="editable" onClick={toggleEdit}>
                  <h4>{task?.title}</h4>
                  <p>{task?.description}</p>
                </div>
              </div>
              <div className="task-actions">
                <Button icon={faList} alternative="reverse" size="sx" />
                <Button icon={faTag} alternative="reverse" size="sx" />
                <Button icon={faFlag} alternative="reverse" size="sx" />
                <Button icon={faEllipsisH} alternative="reverse" size="sx" />
              </div>
            </>
          )}
        </div>
        <Tabs>
          <Tabs.Tab
            id="Sub-tasks"
            title="Sub-tasks"
            content={<SubTasksTab />}
          />
          <Tabs.Tab id="Comments" title="Comments" content={<CommentsTab />} />
        </Tabs>
        <ConfirmDialog {...dialogProps} />
      </StyledModal>
    );
  }
);

export default TaskDetailsModal;
