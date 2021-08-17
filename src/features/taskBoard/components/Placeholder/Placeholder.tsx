import { FC } from "react";
import StyledPlaceholder from "./Placeholder.style";

type PlaceholderProps = {
  height: string;
};
const Placeholder: FC<PlaceholderProps> = (props) => {
  return <StyledPlaceholder height={props.height}></StyledPlaceholder>;
};

export default Placeholder;
