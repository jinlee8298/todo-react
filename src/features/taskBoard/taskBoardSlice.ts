import { createSlice } from "@reduxjs/toolkit";
import taskReducer, { taskAdapter } from "./store/taskReducer";
import sectionReducer, { sectionAdapter } from "./store/sectionReducer";
import labelReducer, { labelAdapter } from "./store/labelReducer";
import projectReducer, { projectAdapter } from "./store/projectReducer";
import commentReducer, { commentAdapter } from "./store/commentReducer";
import defaultState from "./store/defaultStore";

const defaultStateTemplate = {
  tasks: taskAdapter.getInitialState(),
  sections: sectionAdapter.getInitialState(),
  projects: projectAdapter.getInitialState(),
  comments: commentAdapter.getInitialState(),
  labels: labelAdapter.getInitialState(),
};

const peristedState: typeof defaultStateTemplate = JSON.parse(
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
  moveTask,
  addSection,
  updateSection,
  duplicateSection,
  deleteSection,
  repositionSection,
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
