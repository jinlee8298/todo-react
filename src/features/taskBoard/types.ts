import { EntityId } from "@reduxjs/toolkit";

export enum TaskPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
  Urgent = "urgent",
}
export interface Label {
  id: EntityId;
  name: string;
  labelColor?: string;
  taskIds: EntityId[];
}

export interface Comment {
  content: string;
  createdAt: string;
  id: EntityId;
  updatedAt: string;
}

export interface Task {
  commentIds: EntityId[];
  createdAt: string;
  description?: string;
  finished?: boolean;
  id: EntityId;
  labelIds: EntityId[];
  parentTaskId?: EntityId;
  priority: TaskPriority;
  title: string;
  updatedAt: string;
  subTaskIds: EntityId[];
}

export interface TaskSection {
  id: EntityId;
  name: string;
  taskIds: EntityId[];
}

export interface Project {
  id: EntityId;
  sectionIds: EntityId[];
  name: string;
}
