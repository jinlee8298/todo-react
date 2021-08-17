import StyledTaskBoard from "./TaskBoard.style";
import TaskSection from "../TaskSection/TaskSection";
import { DragEventHandler, FC, Fragment } from "react";
import { Button } from "common/components";
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { useDispatch, useSelector } from "common/hooks";
import AddSectionTrigger from "../AddSectionButton/AddSectionButton";
import {
  addSection,
  sectionSelector,
  addSectionAt,
  removeTaskPlaceholder,
} from "../../taskBoardSlice";
import { shallowEqual } from "react-redux";

type TaskBoardProps = {};
let cachedOrder = 0;
const TaskBoard: FC<TaskBoardProps> = (props) => {
  const sections = useSelector(sectionSelector.selectIds, shallowEqual);
  const dispatch = useDispatch();

  const removePlaceholder: DragEventHandler<HTMLDivElement> = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(removeTaskPlaceholder());
    }
  };

  return (
    <StyledTaskBoard onDragEnter={removePlaceholder}>
      {sections.map((sectionId, index) => (
        <Fragment key={sectionId}>
          <TaskSection key={sectionId} sectionId={sectionId} />
          {index !== sections.length - 1 && (
            <AddSectionTrigger
              onClick={(e) => {
                dispatch(addSectionAt(index + 1));
              }}
            />
          )}
        </Fragment>
      ))}
      <Button
        alternative="reverse"
        icon={faPlusSquare}
        onClick={(e) =>
          dispatch(
            addSection({
              projectId: cachedOrder,
              id: new Date().getTime().toString(),
              name: "test" + cachedOrder,
              taskIds: [],
            })
          )
        }
      >
        Add new section
      </Button>
    </StyledTaskBoard>
  );
};

export default TaskBoard;
