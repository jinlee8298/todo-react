import {
  createSlice,
  createEntityAdapter,
  PayloadAction,
  Update,
  EntityId,
} from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { Task, TaskSection, Comment } from "./types";

const sectionAdapter = createEntityAdapter<TaskSection>();

const taskAdapter = createEntityAdapter<Task>();

const commentAdapter = createEntityAdapter<Comment>({
  sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt),
});

const initialState = {
  tasks: taskAdapter.getInitialState<{
    draggingInfo: {
      taskId: EntityId;
      sectionId: EntityId;
      placeholderHeight: string;
      currentPlaceholderSecionId: EntityId | null;
    } | null;
  }>({
    draggingInfo: null,
  }),
  sections: sectionAdapter.getInitialState(),
  comments: commentAdapter.getInitialState(),
};

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

        const newTask: Task = {
          ...task,
          id: generateTaskId(),
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
    updateTask: (state, action: PayloadAction<Update<Omit<Task, "id">>>) => {
      taskAdapter.updateOne(state.tasks, action.payload);
    },
    duplicateTask: {
      prepare: (sectionId, task, index) => ({
        payload: { sectionId, task, index },
      }),
      reducer: (
        state,
        action: PayloadAction<{
          sectionId: EntityId;
          task: Task;
          index: number;
        }>
      ) => {
        const { sectionId, task, index } = action.payload;
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
              state.tasks.draggingInfo.sectionId = destinationSectionId;
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
      prepare: (sectionId, index) => ({
        payload: {
          sectionId,
          index,
        },
      }),
      reducer: (
        state,
        action: PayloadAction<{ index: number; sectionId: EntityId }>
      ) => {
        const { index, sectionId } = action.payload;
        const section = sectionAdapter
          .getSelectors()
          .selectById(state.sections, sectionId);
        if (section) {
          const placeholderIndex = section.taskIds.indexOf("placeholder");
          const taskIds = [...section.taskIds];

          if (placeholderIndex >= 0) {
            taskIds.splice(placeholderIndex, 1);
            taskIds.splice(
              placeholderIndex > index ? index : index - 1,
              0,
              "placeholder"
            );
          } else {
            taskIds.splice(index, 0, "placeholder");
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
        taskId: EntityId;
        sectionId: EntityId;
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
    addSection: (state, action: PayloadAction<TaskSection>) => {
      sectionAdapter.addOne(state.sections, action.payload);
    },
    addSectionAt: (state, action: PayloadAction<number>) => {
      const sections = sectionAdapter.getSelectors().selectAll(state.sections);
      const newSection: TaskSection = {
        id: generateTaskId(),
        projectId: generateTaskId(),
        taskIds: [],
        name: generateTaskId().toString(),
      };
      sections.splice(action.payload, 0, newSection);

      sectionAdapter.upsertMany(
        state.sections,
        sections.map((s, index) => ({ ...s, order: index }))
      );
    },
    updateSection: (state, action: PayloadAction<Update<TaskSection>>) => {
      sectionAdapter.updateOne(state.sections, action.payload);
    },
    deleteSection: (state, action: PayloadAction<TaskSection>) => {
      const deleteSection = action.payload;
      deleteSection.taskIds.forEach((taskId) => {
        deleteChildTasks(state, taskId);
        taskAdapter.removeOne(state.tasks, taskId);
      });

      sectionAdapter.removeOne(state.sections, deleteSection.id);
    },
    repositionSection: {
      prepare: (section, newOrder) => ({
        payload: {
          section,
          newOrder,
        },
      }),
      reducer: (
        state,
        action: PayloadAction<{ section: TaskSection; newOrder: number }>
      ) => {},
    },
    addComment: (state, action: PayloadAction<Comment>) => {
      commentAdapter.addOne(state.comments, action.payload);
    },
    updateComment: (state, action: PayloadAction<Update<Comment>>) => {
      commentAdapter.updateOne(state.comments, action.payload);
    },
    deleteComment: (state, action: PayloadAction<EntityId>) => {
      commentAdapter.removeOne(state.comments, action.payload);
    },
  },
});

export const taskSelector = taskAdapter.getSelectors(
  (state: RootState) => state.taskBoard.tasks
);
export const sectionSelector = sectionAdapter.getSelectors(
  (state: RootState) => state.taskBoard.sections
);
export const commentSelector = commentAdapter.getSelectors(
  (state: RootState) => state.taskBoard.comments
);

export const {
  addTask,
  updateTask,
  duplicateTask,
  deleteTask,
  repositionTask,
  insertTaskPlaceholder,
  removeTaskPlaceholder,
  setDraggingTaskData,
  addSection,
  addSectionAt,
  updateSection,
  deleteSection,
  addComment,
  updateComment,
  deleteComment,
} = taskBoardSlice.actions;

export default taskBoardSlice.reducer;
