import {
  createEntityAdapter,
  EntityId,
  PayloadAction,
  Update,
} from "@reduxjs/toolkit";
import { TaskBoardStore } from "../taskBoardSlice";
import { TaskSection } from "../types";
import { projectAdapter, projectSelector } from "./projectReducer";
import {
  deleteTaskHandler,
  duplicateTaskHandler,
  generateTaskId,
} from "./taskReducer";

export const sectionAdapter = createEntityAdapter<TaskSection>();
export const sectionSelector = sectionAdapter.getSelectors(
  (state: TaskBoardStore) => state.sections
);

export const duplicateSectionHandler = (
  state: TaskBoardStore,
  projectId: EntityId,
  sectionId: EntityId
) => {
  const originSection = sectionSelector.selectById(state, sectionId);
  const project = projectSelector.selectById(state, projectId);

  if (!originSection || !project) {
    return;
  }

  const newSection: TaskSection = {
    name: originSection.name,
    taskIds: [],
    finishedTaskIds: [],
    id: generateTaskId(),
  };
  originSection.taskIds.forEach((taskId) => {
    const duplicatedTaskId = duplicateTaskHandler(
      state,
      undefined,
      undefined,
      taskId,
      false
    );
    newSection.taskIds.push(duplicatedTaskId);
  });
  originSection.finishedTaskIds.forEach((taskId) => {
    const duplicatedTaskId = duplicateTaskHandler(
      state,
      undefined,
      undefined,
      taskId,
      false
    );
    newSection.finishedTaskIds.push(duplicatedTaskId);
  });
  sectionAdapter.addOne(state.sections, newSection);
  projectAdapter.updateOne(state.projects, {
    id: projectId,
    changes: {
      sectionIds: [...project.sectionIds, newSection.id],
    },
  });
};

export const deleteSectionHandler = (
  state: TaskBoardStore,
  projectId: EntityId,
  sectionId: EntityId
) => {
  const project = projectSelector.selectById(state, projectId);
  const deleteSection = sectionSelector.selectById(state, sectionId);

  projectAdapter.updateOne(state.projects, {
    id: projectId,
    changes: {
      sectionIds: project?.sectionIds.filter((id) => id !== sectionId),
    },
  });

  sectionAdapter.removeOne(state.sections, sectionId);

  if (deleteSection) {
    deleteSection.taskIds.forEach((taskId) => {
      deleteTaskHandler(state, sectionId, taskId);
    });
    deleteSection.finishedTaskIds.forEach((taskId) => {
      deleteTaskHandler(state, sectionId, taskId);
    });
  }
};

// Reducer

const addSection = {
  prepare: (
    projectId: EntityId,
    section: Omit<TaskSection, "id" | "taskIds" | "finishedTaskIds">,
    index = -1
  ) => ({
    payload: { projectId, section, index },
  }),
  reducer: (
    state: TaskBoardStore,
    action: PayloadAction<{
      projectId: EntityId;
      section: Omit<TaskSection, "id" | "taskIds" | "finishedTaskIds">;
      index: number;
    }>
  ) => {
    const { projectId, section, index } = action.payload;
    const project = projectAdapter
      .getSelectors()
      .selectById(state.projects, projectId);

    if (!project) {
      return;
    }

    const newSection: TaskSection = {
      ...section,
      id: generateTaskId(),
      taskIds: [],
      finishedTaskIds: [],
    };
    const sectionIds = [...project.sectionIds];
    sectionIds.splice(
      index >= 0 ? index : project.sectionIds.length,
      0,
      newSection.id
    );

    sectionAdapter.addOne(state.sections, newSection);
    projectAdapter.updateOne(state.projects, {
      id: projectId,
      changes: { sectionIds },
    });
  },
};

const updateSection = (
  state: TaskBoardStore,
  action: PayloadAction<Update<Omit<TaskSection, "id">>>
) => {
  sectionAdapter.updateOne(state.sections, action.payload);
};

const duplicateSection = {
  prepare: (projectId: EntityId, sectionId: EntityId) => ({
    payload: { projectId, sectionId },
  }),
  reducer: (
    state: TaskBoardStore,
    action: PayloadAction<{ projectId: EntityId; sectionId: EntityId }>
  ) => {
    const { projectId, sectionId } = action.payload;
    duplicateSectionHandler(state, projectId, sectionId);
  },
};

const deleteSection = {
  prepare: (projectId: EntityId, sectionId: EntityId) => ({
    payload: { projectId, sectionId },
  }),
  reducer: (
    state: TaskBoardStore,
    action: PayloadAction<{ projectId: EntityId; sectionId: EntityId }>
  ) => {
    const { projectId, sectionId } = action.payload;
    deleteSectionHandler(state, projectId, sectionId);
  },
};

const repositionSection = {
  prepare: (projectId: EntityId, sectionId: EntityId, index: number) => ({
    payload: { projectId, sectionId, index },
  }),
  reducer: (
    state: TaskBoardStore,
    action: PayloadAction<{
      projectId: EntityId;
      sectionId: EntityId;
      index: number;
    }>
  ) => {
    const { projectId, sectionId, index } = action.payload;
    const project = projectSelector.selectById(state, projectId);
    if (project) {
      const currentSectionIndex = project.sectionIds.indexOf(sectionId);

      if (currentSectionIndex === index) {
        return;
      }

      const sectionIds = [...project.sectionIds];
      sectionIds.splice(currentSectionIndex, 1);
      sectionIds.splice(
        currentSectionIndex > index ? index : index - 1,
        0,
        sectionId
      );

      projectAdapter.updateOne(state.projects, {
        id: projectId,
        changes: { sectionIds },
      });
    }
  },
};

const setDraggingSectionData = (
  state: TaskBoardStore,
  action: PayloadAction<{
    draggingSectionId: EntityId;
    placeholderHeight: string;
  } | null>
) => {
  state.sections.draggingInfo = action.payload;
};

const insertSectionPlaceholder = {
  prepare: (
    projectId: EntityId,
    sectionId: EntityId | null,
    index: number | null
  ) => ({
    payload: {
      projectId,
      sectionId,
      index,
    },
  }),
  reducer: (
    state: TaskBoardStore,
    action: PayloadAction<{
      projectId: EntityId;
      sectionId: EntityId | null;
      index: number | null;
    }>
  ) => {
    const { index, projectId, sectionId } = action.payload;
    const project = projectSelector.selectById(state, projectId);
    if (project) {
      const placeholderIndex = project.sectionIds.indexOf("placeholder");
      const sectionIds = [...project.sectionIds];

      let tempIndex = index ?? -1;
      if (tempIndex < 0 && sectionId) {
        tempIndex = sectionIds.indexOf(sectionId);
      }

      if (placeholderIndex >= 0) {
        sectionIds.splice(placeholderIndex, 1);
        sectionIds.splice(
          placeholderIndex > tempIndex ? tempIndex + 1 : tempIndex,
          0,
          "placeholder"
        );
      } else {
        sectionIds.splice(tempIndex + 1, 0, "placeholder");
      }

      projectAdapter.updateOne(state.projects, {
        id: projectId,
        changes: { sectionIds },
      });
    }
  },
};

const removeSectionPlaceholder = (
  state: TaskBoardStore,
  action: PayloadAction<EntityId>
) => {
  const project = projectSelector.selectById(state, action.payload);
  if (project) {
    const placeholderIndex = project.sectionIds.indexOf("placeholder");
    if (placeholderIndex >= 0) {
      projectAdapter.updateOne(state.projects, {
        id: project.id,
        changes: {
          sectionIds: project.sectionIds.filter((id) => id !== "placeholder"),
        },
      });
    }
  }
};

const sectionReducer = {
  addSection,
  updateSection,
  duplicateSection,
  deleteSection,
  repositionSection,
  setDraggingSectionData,
  insertSectionPlaceholder,
  removeSectionPlaceholder,
};

export default sectionReducer;
