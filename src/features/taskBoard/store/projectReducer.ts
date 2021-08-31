import {
  createEntityAdapter,
  EntityId,
  PayloadAction,
  Update,
} from "@reduxjs/toolkit";
import { TaskBoardStore } from "../taskBoardSlice";
import { Project } from "../types";
import {
  deleteSectionHandler,
  duplicateSectionHandler,
} from "./sectionReducer";
import { generateTaskId } from "./taskReducer";

export const projectAdapter = createEntityAdapter<Project>();
export const projectSelector = projectAdapter.getSelectors(
  (state: TaskBoardStore) => state.projects
);

const addProject = (
  state: TaskBoardStore,
  action: PayloadAction<Omit<Project, "id" | "sectionIds" | "filterOptions">>
) => {
  const newProject = {
    ...action.payload,
    id: generateTaskId(),
    sectionIds: [],
    filterOptions: { showCompletedTask: false },
  };
  projectAdapter.addOne(state.projects, newProject);
};

const deleteProject = (
  state: TaskBoardStore,
  action: PayloadAction<EntityId>
) => {
  const projectToDelete = projectSelector.selectById(state, action.payload);
  if (projectToDelete) {
    projectToDelete.sectionIds.forEach((sectionId) =>
      deleteSectionHandler(state, action.payload, sectionId)
    );

    projectAdapter.removeOne(state.projects, action.payload);
  }
};

const updateProject = (
  state: TaskBoardStore,
  action: PayloadAction<Update<Omit<Project, "id">>>
) => {
  projectAdapter.updateOne(state.projects, action.payload);
};

const duplicateProject = (
  state: TaskBoardStore,
  action: PayloadAction<EntityId>
) => {
  const originProject = projectSelector.selectById(state, action.payload);
  if (!originProject) {
    return;
  }

  const newProject = {
    ...originProject,
    name: `Copy of ${originProject.name}`,
    sectionIds: [],
    id: generateTaskId(),
  };

  projectAdapter.addOne(state.projects, newProject);

  if (originProject.sectionIds.length > 0) {
    originProject.sectionIds.forEach((sectionId) => {
      duplicateSectionHandler(state, newProject.id, sectionId);
    });
  }
};

const projectReducer = {
  addProject,
  deleteProject,
  updateProject,
  duplicateProject,
};

export default projectReducer;
