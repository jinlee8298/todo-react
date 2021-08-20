import { FC } from "react";
import StyledPlaceholder from "./Placeholder.style";

type PlaceholderProps = {
  height: string;
};
const Placeholder: FC<PlaceholderProps> = ({ height, ...rest }) => {
  return <StyledPlaceholder height={height} {...rest}></StyledPlaceholder>;
};

export default Placeholder;
