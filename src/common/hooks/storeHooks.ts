import {
  TypedUseSelectorHook,
  useDispatch as originalUseDispatch,
  useSelector as originalUseSelector,
} from "react-redux";
import type { RootState, AppDispatch } from "app/store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useDispatch = () => originalUseDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = originalUseSelector;
