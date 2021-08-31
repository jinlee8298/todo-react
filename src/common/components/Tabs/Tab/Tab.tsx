import { FC, ReactElement, ReactNode } from "react";

export type TabProps = {
  id: string;
  content?: ReactElement | ReactElement[];
  title: ReactNode;
  disabled?: boolean;
};

const Tab: FC<TabProps> = ({ content, disabled = false }) => {
  return <section aria-hidden={disabled}>{content}</section>;
};

export default Tab;
