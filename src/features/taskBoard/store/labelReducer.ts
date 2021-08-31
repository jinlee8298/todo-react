import {
  createEntityAdapter,
  EntityId,
  PayloadAction,
  Update,
} from "@reduxjs/toolkit";
import { generateUID } from "common/utilitites";
import { TaskBoardStore } from "../taskBoardSlice";
import { Label } from "../types";
import { taskAdapter, taskSelector, updateTaskHandler } from "./taskReducer";

export const labelAdapter = createEntityAdapter<Label>();
export const labelSelector = labelAdapter.getSelectors(
  (state: TaskBoardStore) => state.labels
);

// Reducer

const addLabel = (
  state: TaskBoardStore,
  action: PayloadAction<Omit<Label, "id" | "taskIds">>
) => {
  const newLabel = {
    ...action.payload,
    id: generateUID(),
    taskIds: [],
  };
  labelAdapter.addOne(state.labels, newLabel);
};

const addLabelThenAssignToTask = {
  prepare: (taskId: EntityId, label: Omit<Label, "id" | "taskIds">) => ({
    payload: { taskId, label },
  }),
  reducer: (
    state: TaskBoardStore,
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
        id: generateUID(),
        taskIds: [taskId],
      };

      labelAdapter.addOne(state.labels, newLabel);
      updateTaskHandler(state, {
        id: taskId,
        changes: { labelIds: [...task.labelIds, newLabel.id] },
      });
    }
  },
};

const addLabelToTask = {
  prepare: (taskId: EntityId, labelId: EntityId) => ({
    payload: { taskId, labelId },
  }),
  reducer: (
    state: TaskBoardStore,
    action: PayloadAction<{ taskId: EntityId; labelId: EntityId }>
  ) => {
    const { taskId, labelId } = action.payload;
    const task = taskSelector.selectById(state, taskId);
    const label = labelSelector.selectById(state, labelId);
    if (!task || !label) {
      return;
    }

    updateTaskHandler(state, {
      id: taskId,
      changes: { labelIds: [...task.labelIds, labelId] },
    });
    labelAdapter.updateOne(state.labels, {
      id: labelId,
      changes: { taskIds: [...label.taskIds, taskId] },
    });
  },
};

const removeLabelFromTask = {
  prepare: (taskId: EntityId, labelId: EntityId) => ({
    payload: { taskId, labelId },
  }),
  reducer: (
    state: TaskBoardStore,
    action: PayloadAction<{ taskId: EntityId; labelId: EntityId }>
  ) => {
    const { taskId, labelId } = action.payload;
    const task = taskSelector.selectById(state, taskId);
    const label = labelSelector.selectById(state, labelId);
    if (!task || !label) {
      return;
    }

    updateTaskHandler(state, {
      id: taskId,
      changes: { labelIds: task.labelIds.filter((id) => id !== labelId) },
    });
    labelAdapter.updateOne(state.labels, {
      id: labelId,
      changes: { taskIds: label.taskIds.filter((id) => id !== taskId) },
    });
  },
};

const updateLabel = (
  state: TaskBoardStore,
  action: PayloadAction<Update<Label>>
) => {
  labelAdapter.updateOne(state.labels, action.payload);
};

const deleteLabel = (
  state: TaskBoardStore,
  action: PayloadAction<EntityId>
) => {
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
};

const labelReducer = {
  addLabel,
  addLabelThenAssignToTask,
  addLabelToTask,
  removeLabelFromTask,
  updateLabel,
  deleteLabel,
};

export default labelReducer;
