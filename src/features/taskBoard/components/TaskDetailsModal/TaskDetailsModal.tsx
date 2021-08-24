import StyledModal from "./TaskDetailsModal.style";
import {
  Button,
  Checkbox,
  Label as LabelComponent,
  Tabs,
} from "common/components";
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
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TaskEditor from "../TaskEditor/TaskEditor";
import SubTasksTab from "./SubTasksTab/SubTasksTab";
import CommentsTab from "./CommentsTab/CommentsTab";
import {
  labelSelector,
  taskSelector,
  updateTask,
} from "features/taskBoard/taskBoardSlice";
import { useConfirmDialog, useDispatch, useSelector } from "common/hooks";
import { ConfirmDialog } from "common/components";
import TaskPrioritySelect from "../TaskEditor/TaskPrioritySelect/TaskPrioritySelect";
import { SelectItem } from "common/components/Select/SelectItem/SelectItem";
import { Label, TaskPriority } from "features/taskBoard/types";
import TaskLabelSelect from "../TaskEditor/TaskLabelSelect/TaskLabelSelect";
import { shallowEqual } from "react-redux";

type TaskDetailsModalProps = {
  isShown: boolean;
  handleClose?: () => void;
};

const TaskDetailsModal: FC<TaskDetailsModalProps> = memo(
  ({ isShown, handleClose }) => {
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const taskId = useSelector(
      (state) => state.taskBoard.extras.currentViewTaskId
    );
    const task = useSelector((state) =>
      taskSelector.selectById(state.taskBoard, taskId)
    );
    const taskLabels = useSelector((state) => {
      return task
        ? task.labelIds.map(
            (id) => labelSelector.selectEntities(state.taskBoard)[id]
          )
        : task;
    }, shallowEqual) as Label[] | undefined;
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
              onCloseHandle={toggleEdit}
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
              <div className="label-wrapper">
                {taskLabels?.map((label) => (
                  <LabelComponent key={label.id} title={label?.name}>
                    {label.name}
                  </LabelComponent>
                ))}
              </div>
              <div className="task-actions">
                <Button icon={faList} alternative="reverse" size="sx" />
                <TaskLabelSelect taskId={task?.id} mode="standalone" />
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
