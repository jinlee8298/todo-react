import {
  createEntityAdapter,
  EntityId,
  PayloadAction,
  Update,
} from "@reduxjs/toolkit";
import { generateUID } from "common/utilitites";
import { TaskBoardStore } from "../taskBoardSlice";
import { Task } from "../types";
import { commentAdapter, commentSelector } from "./commentReducer";
import { labelAdapter, labelSelector } from "./labelReducer";
import { sectionAdapter, sectionSelector } from "./sectionReducer";

export const taskAdapter = createEntityAdapter<Task>();
export const taskSelector = taskAdapter.getSelectors(
  (state: TaskBoardStore) => state.tasks
);

export const deleteTaskHandler = (
  state: TaskBoardStore,
  sectionId: EntityId | undefined,
  taskId: EntityId
) => {
  if (sectionId) {
    const section = sectionSelector.selectById(state, sectionId);
    if (section) {
      const taskIds = [...section.taskIds];
      sectionAdapter.updateOne(state.sections, {
        id: sectionId,
        changes: { taskIds: taskIds.filter((id) => id !== taskId) },
      });
    }
  }

  const taskToDelete = taskSelector.selectById(state, taskId);
  if (!taskToDelete) {
    return;
  }

  // Remove taskId from label entity
  if (taskToDelete.labelIds.length > 0) {
    taskToDelete.labelIds.forEach((labelId) => {
      const label = labelSelector.selectById(state, labelId);
      if (label) {
        labelAdapter.updateOne(state.labels, {
          id: labelId,
          changes: { taskIds: label.taskIds.filter((id) => id !== taskId) },
        });
      }
    });
  }

  // Remove all comments belongs to taskToDelete
  if (taskToDelete.commentIds.length > 0) {
    commentAdapter.removeMany(state.comments, taskToDelete.commentIds);
  }

  if (taskToDelete.subTaskIds.length > 0) {
    taskToDelete.subTaskIds.forEach((subTaskId) =>
      deleteTaskHandler(state, undefined, subTaskId)
    );
  }

  if (taskToDelete.parentTaskId) {
    const parentTask = taskSelector.selectById(
      state,
      taskToDelete.parentTaskId
    );
    if (parentTask) {
      taskAdapter.updateOne(state.tasks, {
        id: parentTask.id,
        changes: {
          subTaskIds: parentTask.subTaskIds?.filter((id) => id !== taskId),
        },
      });
    }
  }

  taskAdapter.removeOne(state.tasks, taskId);
};

export const duplicateTaskHandler = (
  state: TaskBoardStore,
  sectionId: EntityId | undefined,
  parentId: EntityId | undefined,
  taskId: EntityId,
  duplicateComments: boolean
): EntityId => {
  const originTask = taskSelector.selectById(state, taskId);
  if (!originTask) {
    return -1;
  }

  const createdAt = new Date().toJSON();
  const duplicatedTask = {
    ...originTask,
    id: generateUID(),
    updatedAt: createdAt,
    createdAt,
  };

  if (parentId) {
    duplicatedTask.parentTaskId = parentId;
  }

  if (sectionId) {
    const section = sectionSelector.selectById(state, sectionId);
    if (section) {
      const originIndex = section.taskIds.findIndex((id) => id === taskId);
      const sectionTaskIds = [...section.taskIds];
      sectionTaskIds.splice(originIndex + 1, 0, duplicatedTask.id);
      sectionAdapter.updateOne(state.sections, {
        id: sectionId,
        changes: { taskIds: sectionTaskIds },
      });
    }
  }

  duplicatedTask.commentIds = [];
  if (originTask.commentIds.length > 0 && duplicateComments) {
    originTask.commentIds.forEach((commentId) => {
      const comment = commentSelector.selectById(state, commentId);
      if (comment) {
        const createdAt = new Date().toJSON();
        const newComment = {
          ...comment,
          id: generateUID(),
          updatedAt: createdAt,
          createdAt,
        };
        commentAdapter.addOne(state.comments, newComment);
        duplicatedTask.commentIds.push(newComment.id);
      }
    });
  }

  if (originTask.subTaskIds.length > 0) {
    duplicatedTask.subTaskIds = [];
    originTask.subTaskIds.forEach((subTaskId) => {
      const newSubTaskId = duplicateTaskHandler(
        state,
        undefined,
        duplicatedTask.id,
        subTaskId,
        duplicateComments
      );
      duplicatedTask.subTaskIds.push(newSubTaskId);
    });
  }

  taskAdapter.addOne(state.tasks, duplicatedTask);

  if (originTask.labelIds.length > 0) {
    originTask.labelIds.forEach((labelId) => {
      const label = labelSelector.selectById(state, labelId);
      if (label) {
        labelAdapter.updateOne(state.labels, {
          id: labelId,
          changes: {
            taskIds: [...label.taskIds, duplicatedTask.id],
          },
        });
      }
    });
  }

  if (duplicatedTask.parentTaskId) {
    const parentTask = taskSelector.selectById(
      state,
      duplicatedTask.parentTaskId
    );
    if (parentTask) {
      const originIndex = parentTask.subTaskIds.findIndex(
        (id) => id === taskId
      );
      const parentSubTaskIds = [...parentTask.subTaskIds];
      parentSubTaskIds.splice(originIndex + 1, 0, duplicatedTask.id);
      taskAdapter.updateOne(state.tasks, {
        id: parentTask.id,
        changes: { subTaskIds: parentSubTaskIds },
      });
    }
  }

  return duplicatedTask.id;
};

export const markTaskFinished = (state: TaskBoardStore, taskId: EntityId) => {
  const task = taskSelector.selectById(state, taskId);
  if (!task) {
    return;
  }

  if (task.subTaskIds.length > 0) {
    task.subTaskIds.forEach((subTaskId) => markTaskFinished(state, subTaskId));
  }

  taskAdapter.updateOne(state.tasks, {
    id: taskId,
    changes: { finished: true },
  });
};

export const markTaskUnfinished = (state: TaskBoardStore, taskId: EntityId) => {
  const task = taskSelector.selectById(state, taskId);
  if (!task) {
    return;
  }

  if (task.parentTaskId) {
    markTaskUnfinished(state, task.parentTaskId);
  }

  taskAdapter.updateOne(state.tasks, {
    id: taskId,
    changes: { finished: false },
  });
};

export const updateTaskHandler = (
  state: TaskBoardStore,
  update: Update<Omit<Task, "id" | "updatedAt" | "createdAt">>
) => {
  const updateObj = update as Update<Omit<Task, "id">>;
  updateObj.changes.updatedAt = new Date().toJSON();

  taskAdapter.updateOne(state.tasks, updateObj);
};

// Reducer section

const addTask = {
  prepare: (
    sectionId: EntityId,
    task: Omit<
      Task,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "commentIds"
      | "subTaskIds"
      | "finished"
    >
  ) => ({
    payload: { sectionId, task },
  }),
  reducer: (
    state: TaskBoardStore,
    action: PayloadAction<{
      sectionId: EntityId;
      task: Omit<
        Task,
        | "id"
        | "createdAt"
        | "updatedAt"
        | "commentIds"
        | "subTaskIds"
        | "finished"
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
      id: generateUID(),
      createdAt,
      updatedAt: createdAt,
      commentIds: [],
      subTaskIds: [],
      finished: false,
      sectionId,
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
};

const addSubTask = {
  prepare: (
    parentTaskId: EntityId,
    task: Omit<
      Task,
      | "id"
      | "createdAt"
      | "updatedAt"
      | "commentIds"
      | "subTaskIds"
      | "finished"
    >
  ) => ({
    payload: { parentTaskId, task },
  }),
  reducer: (
    state: TaskBoardStore,
    action: PayloadAction<{
      parentTaskId: EntityId;
      task: Omit<
        Task,
        | "id"
        | "createdAt"
        | "updatedAt"
        | "commentIds"
        | "subTaskIds"
        | "finished"
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
      id: generateUID(),
      createdAt,
      updatedAt: createdAt,
      parentTaskId,
      commentIds: [],
      subTaskIds: [],
      finished: false,
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

    updateTaskHandler(state, {
      id: parentTaskId,
      changes: { subTaskIds: parentSubTaskIds },
    });
  },
};
const toggleTask = {
  prepare: (sectionId: EntityId | undefined, taskId: EntityId) => ({
    payload: { sectionId, taskId },
  }),
  reducer: (
    state: TaskBoardStore,
    action: PayloadAction<{ sectionId: EntityId | undefined; taskId: EntityId }>
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
};

const updateTask = (
  state: TaskBoardStore,
  action: PayloadAction<Update<Omit<Task, "id" | "updatedAt" | "finished">>>
) => {
  updateTaskHandler(state, action.payload);
};

const duplicateTask = {
  prepare: (
    sectionId: EntityId | undefined,
    parentId: EntityId | undefined,
    taskId: EntityId,
    duplicateComments = false
  ) => ({
    payload: { sectionId, parentId, taskId, duplicateComments },
  }),
  reducer: (
    state: TaskBoardStore,
    action: PayloadAction<{
      sectionId: EntityId | undefined;
      parentId: EntityId | undefined;
      taskId: EntityId;
      duplicateComments: boolean;
    }>
  ) => {
    const { sectionId, parentId, taskId, duplicateComments } = action.payload;
    duplicateTaskHandler(state, sectionId, parentId, taskId, duplicateComments);
  },
};

const deleteTask = {
  prepare: (sectionId: EntityId | undefined, taskId: EntityId) => ({
    payload: { sectionId, taskId },
  }),
  reducer: (
    state: TaskBoardStore,
    action: PayloadAction<{ sectionId: EntityId | undefined; taskId: EntityId }>
  ) => {
    const { sectionId, taskId } = action.payload;
    deleteTaskHandler(state, sectionId, taskId);
  },
};

const repositionTask = {
  prepare: (
    destinationSectionId: EntityId,
    originSectionId: EntityId,
    taskId: EntityId,
    index: number
  ) => ({
    payload: { destinationSectionId, originSectionId, taskId, index },
  }),
  reducer: (
    state: TaskBoardStore,
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

        taskAdapter.updateOne(state.tasks, {
          id: taskId,
          changes: {
            sectionId: destinationSectionId,
          },
        });
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
        taskIds.splice(currentTaskIndex > index ? index : index - 1, 0, taskId);

        sectionAdapter.updateOne(state.sections, {
          id: destinationSectionId,
          changes: { taskIds },
        });
      }
    }
  },
};

const taskReducer = {
  addTask,
  addSubTask,
  toggleTask,
  updateTask,
  duplicateTask,
  deleteTask,
  repositionTask,
};

export default taskReducer;
