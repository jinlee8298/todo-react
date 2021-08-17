import { EntityId } from "@reduxjs/toolkit";

export enum TaskPriority {
  Low,
  Medium,
  High,
  Urgent,
}
export interface LabeL {
  id: EntityId;
  name: string;
  order: number;
}

export interface Comment {
  content: string;
  createdAt: string;
  id: EntityId;
  updatedAt: string;
}

export interface Task {
  childOrder?: number;
  commentIds?: EntityId[];
  createdAt: string;
  description?: string;
  finished?: boolean;
  id: EntityId;
  label?: EntityId[];
  parentTaskId?: EntityId;
  priority?: TaskPriority;
  title: string;
  updatedAt: string;
}

export interface TaskSection {
  id: EntityId;
  projectId: EntityId;
  name: string;
  taskIds: EntityId[];
}
