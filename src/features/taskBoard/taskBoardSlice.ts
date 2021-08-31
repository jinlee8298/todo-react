import { createSlice, EntityId } from "@reduxjs/toolkit";
import { COLOR_LIST } from "common/constants";
import taskReducer, { taskAdapter } from "./store/taskReducer";
import sectionReducer, { sectionAdapter } from "./store/sectionReducer";
import labelReducer, { labelAdapter } from "./store/labelReducer";
import projectReducer, { projectAdapter } from "./store/projectReducer";
import commentReducer, { commentAdapter } from "./store/commentReducer";

const defaultState = {
  tasks: taskAdapter.getInitialState<{
    draggingInfo: {
      draggingTaskId: EntityId;
      originSectionId: EntityId;
      placeholderHeight: string;
      currentPlaceholderSecionId: EntityId | null;
    } | null;
  }>({
    draggingInfo: null,
  }),
  sections: sectionAdapter.getInitialState<{
    draggingInfo: {
      draggingSectionId: EntityId;
      placeholderHeight: string;
    } | null;
  }>({ draggingInfo: null }),
  projects: projectAdapter.getInitialState({
    ids: ["2021"],
    entities: {
      "2021": {
        id: "2021",
        name: "Welcome",
        color: COLOR_LIST[0],
        sectionIds: [],
        filterOptions: { showCompletedTask: false },
      },
    },
  }),
  comments: commentAdapter.getInitialState(),
  labels: labelAdapter.getInitialState(),
};

const peristedState: typeof defaultState = JSON.parse(
  localStorage.getItem("store") || "{}"
)?.taskBoard;

export const initialState = peristedState || defaultState;

export type TaskBoardStore = typeof initialState;

export const taskBoardSlice = createSlice({
  name: "taskBoard",
  initialState,
  reducers: {
    ...taskReducer,
    ...sectionReducer,
    ...commentReducer,
    ...labelReducer,
    ...projectReducer,
  },
});

export const {
  addTask,
  addSubTask,
  toggleTask,
  updateTask,
  duplicateTask,
  deleteTask,
  repositionTask,
  insertTaskPlaceholder,
  removeTaskPlaceholder,
  setDraggingTaskData,
  addSection,
  updateSection,
  duplicateSection,
  deleteSection,
  repositionSection,
  setDraggingSectionData,
  insertSectionPlaceholder,
  removeSectionPlaceholder,
  addComment,
  updateComment,
  deleteComment,
  addLabel,
  addLabelThenAssignToTask,
  addLabelToTask,
  removeLabelFromTask,
  updateLabel,
  deleteLabel,
  addProject,
  deleteProject,
  updateProject,
  duplicateProject,
} = taskBoardSlice.actions;

export default taskBoardSlice.reducer;
