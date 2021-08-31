import { configureStore } from "@reduxjs/toolkit";
import taskBoardReducer from "features/taskBoard/taskBoardSlice";
import { debounce } from "common/utilitites";

export const store = configureStore({
  reducer: { taskBoard: taskBoardReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

store.subscribe(
  debounce(() => {
    localStorage.setItem("store", JSON.stringify(store.getState()));
  }, 1000)
);
