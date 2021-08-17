import { configureStore } from "@reduxjs/toolkit";
import taskBoardReducer from "features/taskBoard/taskBoardSlice";

export const store = configureStore({
  reducer: { taskBoard: taskBoardReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
