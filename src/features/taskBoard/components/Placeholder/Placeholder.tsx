import { FC } from "react";
import StyledPlaceholder from "./Placeholder.style";

type PlaceholderProps = {
  height: string;
};
const Placeholder: FC<PlaceholderProps> = (props) => {
  const { height, ...rest } = props;
  return (
    <StyledPlaceholder height={props.height} {...rest}></StyledPlaceholder>
  );
};

export default Placeholder;
