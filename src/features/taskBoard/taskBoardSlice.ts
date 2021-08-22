import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  Update,
  EntityId,
} from "@reduxjs/toolkit";
import { Task, TaskSection, Comment, Project, Label } from "./types";

export const projectAdapter = createEntityAdapter<Project>();

export const sectionAdapter = createEntityAdapter<TaskSection>();

export const taskAdapter = createEntityAdapter<Task>();

export const labelAdapter = createEntityAdapter<Label>();

export const commentAdapter = createEntityAdapter<Comment>({
  sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt),
});

const initialState = {
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
    entities: { "2021": { id: "2021", name: "Welcome", sectionIds: [] } },
  }),
  comments: commentAdapter.getInitialState(),
  labels: labelAdapter.getInitialState(),
  extras: {
    currentViewTaskId: "0" as EntityId,
  },
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

const generateTaskId = (): EntityId => {
  return Date.now().toString();
};

const deleteChildTasks = (state: typeof initialState, taskId: EntityId) => {
  let childTasks = taskAdapter
    .getSelectors()
    .selectAll(state.tasks)
    .filter((t) => t.parentTaskId === taskId);

  if (childTasks.length > 0) {
    childTasks.forEach((t) => {
      taskAdapter.removeOne(state.tasks, t.id);
      deleteChildTasks(state, t.id);
    });
  }
};

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
          task: Omit<Task, "id">;
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
      },
    },
    addSubTask: {
      prepare: (parentTaskId, task) => ({ payload: { parentTaskId, task } }),
      reducer: (
        state,
        action: PayloadAction<{ parentTaskId: EntityId; task: Task }>
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
        };
        const parentSubTaskIds = [...(parentTask.subTaskIds || []), newTask.id];

        taskAdapter.addOne(state.tasks, newTask);
        taskAdapter.updateOne(state.tasks, {
          id: parentTaskId,
          changes: { subTaskIds: parentSubTaskIds },
        });
      },
    },
    updateTask: (
      state,
      action: PayloadAction<Update<Omit<Task, "id" | "updatedAt">>>
    ) => {
      const changes = action.payload as Update<Omit<Task, "id">>;
      changes.changes.updatedAt = new Date().toJSON();
      taskAdapter.updateOne(state.tasks, action.payload);
    },
    duplicateTask: {
      prepare: (sectionId, task) => ({
        payload: { sectionId, task },
      }),
      reducer: (
        state,
        action: PayloadAction<{
          sectionId: EntityId;
          task: Task;
        }>
      ) => {
        const { sectionId, task } = action.payload;
        const duplicatedTask = {
          ...task,
          id: generateTaskId(),
        };
        taskAdapter.addOne(state.tasks, duplicatedTask);

        const section = sectionAdapter
          .getSelectors()
          .selectById(state.sections, sectionId);

        if (section) {
          const taskIds = [...section?.taskIds];
          const index = taskIds.indexOf(task.id);

          taskIds.splice(index + 1, 0, duplicatedTask.id);

          sectionAdapter.updateOne(state.sections, {
            id: sectionId,
            changes: { taskIds },
          });
        }
      },
    },
    deleteTask: {
      prepare: (sectionId, taskId) => ({ payload: { sectionId, taskId } }),
      reducer: (
        state,
        action: PayloadAction<{ sectionId: EntityId; taskId: EntityId }>
      ) => {
        const { sectionId, taskId } = action.payload;
        const section = sectionAdapter
          .getSelectors()
          .selectById(state.sections, sectionId);

        if (section) {
          const taskIds = [...section?.taskIds];
          sectionAdapter.updateOne(state.sections, {
            id: sectionId,
            changes: { taskIds: taskIds.filter((id) => id !== taskId) },
          });
        }

        deleteChildTasks(state, taskId);
        taskAdapter.removeOne(state.tasks, taskId);
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
          section: Omit<TaskSection, "id" | "taskIds">;
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
            deleteChildTasks(state, taskId);
          });
          taskAdapter.removeMany(state.tasks, deleteSection.taskIds);
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
          console.log(index, tempIndex);

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
        taskAdapter.updateOne(state.tasks, {
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
      const updatedComment = action.payload as Update<
        Omit<Comment, "id" | "createdAt">
      >;
      updatedComment.changes.updatedAt = new Date().toJSON();
      commentAdapter.updateOne(state.comments, updatedComment);
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

        taskAdapter.updateOne(state.tasks, {
          id: taskId,
          changes: {
            commentIds: taskComments.filter((id) => id !== commentId),
          },
        });
        commentAdapter.removeOne(state.comments, commentId);
      },
    },
    addLabel: (state, action: PayloadAction<Omit<Label, "id">>) => {
      const newLabel = {
        ...action.payload,
        id: generateTaskId(),
      };
      labelAdapter.addOne(state.labels, newLabel);
    },
    setCurrentViewTaskId: (state, action: PayloadAction<EntityId>) => {
      state.extras.currentViewTaskId = action.payload;
    },
  },
});

export const {
  addTask,
  addSubTask,
  updateTask,
  duplicateTask,
  deleteTask,
  repositionTask,
  insertTaskPlaceholder,
  removeTaskPlaceholder,
  setDraggingTaskData,
  addSection,
  updateSection,
  deleteSection,
  repositionSection,
  setDraggingSectionData,
  insertSectionPlaceholder,
  removeSectionPlaceholder,
  addComment,
  updateComment,
  deleteComment,
  addLabel,
  setCurrentViewTaskId,
} = taskBoardSlice.actions;

export default taskBoardSlice.reducer;
