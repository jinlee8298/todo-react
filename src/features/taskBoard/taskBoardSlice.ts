import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  Update,
  EntityId,
} from "@reduxjs/toolkit";
import { COLOR_LIST } from "common/constants";
import {
  generateTaskId,
  deleteTask as delTask,
  duplicateTask as dupTask,
  updateTask as updTask,
  updateComment as updComment,
  duplicateSection as dupSection,
  markTaskUnfinished,
  markTaskFinished,
} from "./store/storeHelper";
import { Task, TaskSection, Comment, Project, Label } from "./types";

export const projectAdapter = createEntityAdapter<Project>();

export const sectionAdapter = createEntityAdapter<TaskSection>();

export const taskAdapter = createEntityAdapter<Task>();

export const labelAdapter = createEntityAdapter<Label>();

export const commentAdapter = createEntityAdapter<Comment>({
  sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt),
});

const peristedState = JSON.parse(
  localStorage.getItem("store") || "{}"
)?.taskBoard;

export const initialState = peristedState || {
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
      },
    },
  }),
  comments: commentAdapter.getInitialState(),
  labels: labelAdapter.getInitialState(),
};

export const taskSelector = taskAdapter.getSelectors(
  (state: typeof initialState) => state.tasks
);
export const sectionSelector = sectionAdapter.getSelectors(
  (state: typeof initialState) => state.sections
);
export const commentSelector = commentAdapter.getSelectors(
  (state: typeof initialState) => state.comments
);
export const projectSelector = projectAdapter.getSelectors(
  (state: typeof initialState) => state.projects
);
export const labelSelector = labelAdapter.getSelectors(
  (state: typeof initialState) => state.labels
);

export const taskBoardSlice = createSlice({
  name: "taskBoard",
  initialState,
  reducers: {
    addTask: {
      prepare: (sectionId, task) => ({
        payload: { sectionId, task },
      }),
      reducer: (
        state,
        action: PayloadAction<{
          sectionId: EntityId;
          task: Omit<
            Task,
            "id" | "createdAt" | "updatedAt" | "commentIds" | "subTaskIds"
          >;
        }>
      ) => {
        const { sectionId, task } = action.payload;
        const addSection = sectionAdapter
          .getSelectors()
          .selectById(state.sections, sectionId);

        const createdAt = new Date().toJSON();
        const newTask: Task = {
          ...task,
          id: generateTaskId(),
          createdAt,
          updatedAt: createdAt,
          commentIds: [],
          subTaskIds: [],
        };

        taskAdapter.addOne(state.tasks, newTask);

        if (addSection) {
          sectionAdapter.updateOne(state.sections, {
            id: sectionId,
            changes: {
              taskIds: [...addSection?.taskIds, newTask.id],
            },
          });
        }
        if (newTask.labelIds.length > 0) {
          newTask.labelIds.forEach((labelId) => {
            const label = labelSelector.selectById(state, labelId);
            if (label) {
              labelAdapter.updateOne(state.labels, {
                id: labelId,
                changes: { taskIds: [...label.taskIds, newTask.id] },
              });
            }
          });
        }
      },
    },
    addSubTask: {
      prepare: (parentTaskId, task) => ({ payload: { parentTaskId, task } }),
      reducer: (
        state,
        action: PayloadAction<{
          parentTaskId: EntityId;
          task: Omit<
            Task,
            "id" | "createdAt" | "updatedAt" | "commentIds" | "subTaskIds"
          >;
        }>
      ) => {
        const { parentTaskId, task } = action.payload;
        const parentTask = taskSelector.selectById(state, parentTaskId);

        if (!parentTask) {
          return;
        }

        const createdAt = new Date().toJSON();
        const newTask: Task = {
          ...task,
          id: generateTaskId(),
          createdAt,
          updatedAt: createdAt,
          parentTaskId,
          commentIds: [],
          subTaskIds: [],
        };
        const parentSubTaskIds = [...(parentTask.subTaskIds || []), newTask.id];

        taskAdapter.addOne(state.tasks, newTask);

        if (newTask.labelIds.length > 0) {
          newTask.labelIds.forEach((labelId) => {
            const label = labelSelector.selectById(state, labelId);
            if (label) {
              labelAdapter.updateOne(state.labels, {
                id: labelId,
                changes: { taskIds: [...label.taskIds, newTask.id] },
              });
            }
          });
        }

        updTask(state, {
          id: parentTaskId,
          changes: { subTaskIds: parentSubTaskIds },
        });
      },
    },
    toggleTask: {
      prepare: (sectionId, taskId) => ({ payload: { sectionId, taskId } }),
      reducer: (
        state,
        action: PayloadAction<{ sectionId: EntityId | null; taskId: EntityId }>
      ) => {
        const { sectionId, taskId } = action.payload;
        const task = taskSelector.selectById(state, taskId);
        if (!task) {
          return;
        }

        if (task.finished) {
          markTaskUnfinished(state, taskId);
        } else {
          markTaskFinished(state, taskId);
        }

        if (sectionId) {
          const section = sectionSelector.selectById(state, sectionId);
          if (section) {
            sectionAdapter.updateOne(state.sections, {
              id: sectionId,
              changes: {
                taskIds: task.finished
                  ? [...section.taskIds, taskId]
                  : section.taskIds.filter((id) => id !== taskId),
                finishedTaskIds: task.finished
                  ? section.finishedTaskIds.filter((id) => id !== taskId)
                  : [...section.finishedTaskIds, taskId],
              },
            });
          }
        }
      },
    },
    updateTask: (
      state,
      action: PayloadAction<Update<Omit<Task, "id" | "updatedAt" | "finished">>>
    ) => {
      updTask(state, action.payload);
    },
    duplicateTask: {
      prepare: (sectionId, parentId, taskId, duplicateComments = false) => ({
        payload: { sectionId, parentId, taskId, duplicateComments },
      }),
      reducer: (
        state,
        action: PayloadAction<{
          sectionId: EntityId | null;
          parentId: EntityId | null;
          taskId: EntityId;
          duplicateComments: boolean;
        }>
      ) => {
        const { sectionId, parentId, taskId, duplicateComments } =
          action.payload;
        dupTask(state, sectionId, parentId, taskId, duplicateComments);
      },
    },
    deleteTask: {
      prepare: (sectionId, taskId) => ({ payload: { sectionId, taskId } }),
      reducer: (
        state,
        action: PayloadAction<{ sectionId: EntityId; taskId: EntityId }>
      ) => {
        const { sectionId, taskId } = action.payload;

        delTask(state, sectionId, taskId);
      },
    },
    repositionTask: {
      prepare: (destinationSectionId, originSectionId, taskId, index) => ({
        payload: { destinationSectionId, originSectionId, taskId, index },
      }),
      reducer: (
        state,
        action: PayloadAction<{
          destinationSectionId: EntityId;
          originSectionId: EntityId;
          taskId: EntityId;
          index: number;
        }>
      ) => {
        const { taskId, destinationSectionId, originSectionId, index } =
          action.payload;
        const task = taskAdapter.getSelectors().selectById(state.tasks, taskId);

        if (!task) {
          return;
        }

        if (originSectionId !== destinationSectionId) {
          const destinationSection = sectionAdapter
            .getSelectors()
            .selectById(state.sections, destinationSectionId);
          const originSection = sectionAdapter
            .getSelectors()
            .selectById(state.sections, originSectionId);

          if (destinationSection && originSection) {
            const taskIds = [...destinationSection?.taskIds];
            taskIds.splice(index, 0, taskId);

            if (state.tasks.draggingInfo) {
              state.tasks.draggingInfo.originSectionId = destinationSectionId;
            }

            sectionAdapter.updateMany(state.sections, [
              {
                id: originSectionId,
                changes: {
                  taskIds: originSection.taskIds.filter((id) => id !== taskId),
                },
              },
              {
                id: destinationSectionId,
                changes: { taskIds },
              },
            ]);
          }
        } else {
          const section = sectionAdapter
            .getSelectors()
            .selectById(state.sections, destinationSectionId);
          if (section) {
            const currentTaskIndex = section.taskIds.indexOf(taskId);
            if (currentTaskIndex === index) {
              return;
            }
            const taskIds = [...section.taskIds];
            taskIds.splice(currentTaskIndex, 1);
            taskIds.splice(
              currentTaskIndex > index ? index : index - 1,
              0,
              taskId
            );

            sectionAdapter.updateOne(state.sections, {
              id: destinationSectionId,
              changes: { taskIds },
            });
          }
        }
      },
    },
    insertTaskPlaceholder: {
      prepare: (sectionId, taskId, index) => ({
        payload: {
          sectionId,
          index,
          taskId,
        },
      }),
      reducer: (
        state,
        action: PayloadAction<
          | {
              sectionId: EntityId;
              index: number;
              taskId: null;
            }
          | {
              sectionId: EntityId;
              index: null;
              taskId: EntityId;
            }
        >
      ) => {
        const { index, taskId, sectionId } = action.payload;
        const section = sectionAdapter
          .getSelectors()
          .selectById(state.sections, sectionId);
        if (section) {
          const placeholderIndex = section.taskIds.indexOf("placeholder");
          const taskIds = [...section.taskIds];
          let tempIndex = index || 0;
          if (!tempIndex && taskId) {
            tempIndex = taskIds.indexOf(taskId);
          }
          if (placeholderIndex >= 0) {
            taskIds.splice(placeholderIndex, 1);
            taskIds.splice(
              placeholderIndex > tempIndex ? tempIndex : tempIndex - 1,
              0,
              "placeholder"
            );
          } else {
            taskIds.splice(tempIndex, 0, "placeholder");
          }
          const draggingInfo = state.tasks.draggingInfo;
          if (draggingInfo) {
            draggingInfo.currentPlaceholderSecionId = sectionId;
          }
          sectionAdapter.updateOne(state.sections, {
            id: sectionId,
            changes: { taskIds },
          });
        }
      },
    },
    removeTaskPlaceholder: (state) => {
      if (
        state.tasks.draggingInfo &&
        state.tasks.draggingInfo.currentPlaceholderSecionId
      ) {
        const { currentPlaceholderSecionId } = state.tasks.draggingInfo;
        const section = sectionAdapter
          .getSelectors()
          .selectById(state.sections, currentPlaceholderSecionId);
        state.tasks.draggingInfo.currentPlaceholderSecionId = null;

        sectionAdapter.updateOne(state.sections, {
          id: currentPlaceholderSecionId,
          changes: {
            taskIds: section?.taskIds.filter((id) => id !== "placeholder"),
          },
        });
      }
    },
    setDraggingTaskData: (
      state,
      action: PayloadAction<{
        draggingTaskId: EntityId;
        originSectionId: EntityId;
        placeholderHeight: string;
      } | null>
    ) => {
      if (action.payload) {
        state.tasks.draggingInfo = {
          ...action.payload,
          currentPlaceholderSecionId: null,
        };
      } else {
        state.tasks.draggingInfo = null;
      }
    },
    addSection: {
      prepare: (projectId, section, index = -1) => ({
        payload: { projectId, section, index },
      }),
      reducer: (
        state,
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
    },
    updateSection: (
      state,
      action: PayloadAction<Update<Omit<TaskSection, "id">>>
    ) => {
      sectionAdapter.updateOne(state.sections, action.payload);
    },
    duplicateSection: {
      prepare: (projectId, sectionId) => ({
        payload: { projectId, sectionId },
      }),
      reducer: (
        state,
        action: PayloadAction<{ projectId: EntityId; sectionId: EntityId }>
      ) => {
        const { projectId, sectionId } = action.payload;
        dupSection(state, projectId, sectionId);
      },
    },
    deleteSection: {
      prepare: (projectId, sectionId) => ({
        payload: { projectId, sectionId },
      }),
      reducer: (
        state,
        action: PayloadAction<{ projectId: EntityId; sectionId: EntityId }>
      ) => {
        const { projectId, sectionId } = action.payload;
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
            delTask(state, sectionId, taskId);
          });
        }
      },
    },
    repositionSection: {
      prepare: (projectId, sectionId, index) => ({
        payload: { projectId, sectionId, index },
      }),
      reducer: (
        state,
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
    },
    setDraggingSectionData: (
      state,
      action: PayloadAction<{
        draggingSectionId: EntityId;
        placeholderHeight: string;
      } | null>
    ) => {
      state.sections.draggingInfo = action.payload;
    },
    insertSectionPlaceholder: {
      prepare: (projectId, sectionId, index) => ({
        payload: {
          projectId,
          sectionId,
          index,
        },
      }),
      reducer: (
        state,
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
    },
    removeSectionPlaceholder: (state, action: PayloadAction<EntityId>) => {
      const project = projectSelector.selectById(state, action.payload);
      if (project) {
        const placeholderIndex = project.sectionIds.indexOf("placeholder");
        if (placeholderIndex >= 0) {
          projectAdapter.updateOne(state.projects, {
            id: project.id,
            changes: {
              sectionIds: project.sectionIds.filter(
                (id) => id !== "placeholder"
              ),
            },
          });
        }
      }
    },
    addComment: {
      prepare: (taskId, comment) => ({ payload: { taskId, comment } }),
      reducer: (
        state,
        action: PayloadAction<{
          taskId: EntityId;
          comment: Omit<Comment, "id" | "updatedAt" | "createdAt">;
        }>
      ) => {
        const { taskId, comment } = action.payload;
        const task = taskSelector.selectById(state, taskId);
        if (!task) {
          return;
        }

        const createdAt = new Date().toJSON();
        const newComment: Comment = {
          ...comment,
          id: generateTaskId(),
          createdAt,
          updatedAt: createdAt,
        };
        commentAdapter.addOne(state.comments, newComment);

        const taskComments = [...(task.commentIds || []), newComment.id];
        updTask(state, {
          id: taskId,
          changes: { commentIds: taskComments },
        });
      },
    },
    updateComment: (
      state,
      action: PayloadAction<
        Update<Omit<Comment, "id" | "createdAt" | "updatedAt">>
      >
    ) => {
      updComment(state, action.payload);
    },
    deleteComment: {
      prepare: (taskId, commentId) => ({ payload: { taskId, commentId } }),
      reducer: (
        state,
        action: PayloadAction<{ taskId: EntityId; commentId: EntityId }>
      ) => {
        const { taskId, commentId } = action.payload;
        const task = taskSelector.selectById(state, taskId);
        if (!task) {
          return;
        }

        const taskComments = [...(task.commentIds || [])];

        updTask(state, {
          id: taskId,
          changes: {
            commentIds: taskComments.filter((id) => id !== commentId),
          },
        });
        commentAdapter.removeOne(state.comments, commentId);
      },
    },
    addLabel: (state, action: PayloadAction<Omit<Label, "id" | "taskIds">>) => {
      const newLabel = {
        ...action.payload,
        id: generateTaskId(),
        taskIds: [],
      };
      labelAdapter.addOne(state.labels, newLabel);
    },
    addLabelThenAssignToTask: {
      prepare: (taskId, label) => ({ payload: { taskId, label } }),
      reducer: (
        state,
        action: PayloadAction<{
          taskId: EntityId;
          label: Omit<Label, "id" | "taskIds">;
        }>
      ) => {
        const { taskId, label } = action.payload;
        const task = taskSelector.selectById(state, taskId);

        if (task) {
          const newLabel = {
            ...label,
            id: generateTaskId(),
            taskIds: [taskId],
          };

          labelAdapter.addOne(state.labels, newLabel);
          updTask(state, {
            id: taskId,
            changes: { labelIds: [...task.labelIds, newLabel.id] },
          });
        }
      },
    },
    addLabelToTask: {
      prepare: (taskId, labelId) => ({ payload: { taskId, labelId } }),
      reducer: (
        state,
        action: PayloadAction<{ taskId: EntityId; labelId: EntityId }>
      ) => {
        const { taskId, labelId } = action.payload;
        const task = taskSelector.selectById(state, taskId);
        const label = labelSelector.selectById(state, labelId);
        if (!task || !label) {
          return;
        }

        updTask(state, {
          id: taskId,
          changes: { labelIds: [...task.labelIds, labelId] },
        });
        labelAdapter.updateOne(state.labels, {
          id: labelId,
          changes: { taskIds: [...label.taskIds, taskId] },
        });
      },
    },
    removeLabelFromTask: {
      prepare: (taskId, labelId) => ({ payload: { taskId, labelId } }),
      reducer: (
        state,
        action: PayloadAction<{ taskId: EntityId; labelId: EntityId }>
      ) => {
        const { taskId, labelId } = action.payload;
        const task = taskSelector.selectById(state, taskId);
        const label = labelSelector.selectById(state, labelId);
        if (!task || !label) {
          return;
        }

        updTask(state, {
          id: taskId,
          changes: { labelIds: task.labelIds.filter((id) => id !== labelId) },
        });
        labelAdapter.updateOne(state.labels, {
          id: labelId,
          changes: { taskIds: label.taskIds.filter((id) => id !== taskId) },
        });
      },
    },
    updateLabel: (state, action: PayloadAction<Update<Label>>) => {
      labelAdapter.updateOne(state.labels, action.payload);
    },
    deleteLabel: (state, action: PayloadAction<EntityId>) => {
      const label = labelSelector.selectById(state, action.payload);

      if (label) {
        label.taskIds.forEach((taskId) => {
          const task = taskSelector.selectById(state, taskId);
          if (task) {
            const labelIds = [...task?.labelIds];
            taskAdapter.updateOne(state.tasks, {
              id: taskId,
              changes: {
                labelIds: labelIds.filter((id) => id !== action.payload),
              },
            });
          }
        });
        labelAdapter.removeOne(state.labels, action.payload);
      }
    },
    addProject: (
      state,
      action: PayloadAction<Omit<Project, "id" | "sectionIds">>
    ) => {
      const newProject = {
        ...action.payload,
        id: generateTaskId(),
        sectionIds: [],
      };
      projectAdapter.addOne(state.projects, newProject);
    },
    deleteProject: (state, action: PayloadAction<EntityId>) => {
      projectAdapter.removeOne(state.projects, action.payload);
    },
    updateProject: (
      state,
      action: PayloadAction<Update<Omit<Project, "id">>>
    ) => {
      projectAdapter.updateOne(state.projects, action.payload);
    },
    duplicateProject: (state, action: PayloadAction<EntityId>) => {
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
          dupSection(state, newProject.id, sectionId);
        });
      }
    },
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
