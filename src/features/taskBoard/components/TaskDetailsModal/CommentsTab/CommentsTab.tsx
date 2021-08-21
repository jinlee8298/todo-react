import StyledCommentsTab from "./CommentsTab.style";
import { Button, TextArea } from "common/components";
import { useInput } from "common/hooks";

const CommentsTab = () => {
  const [value, , , onChange] = useInput("");
  return (
    <StyledCommentsTab>
      <div className="comment-container"></div>
      <div className="comment-actions">
        <TextArea
          value={value}
          onChange={onChange}
          label="Comment"
          title="Comment"
          minRows={3}
          maxRows={10}
        ></TextArea>
        <div className="button-group">
          <Button size="sm">AddComment</Button>
        </div>
      </div>
    </StyledCommentsTab>
  );
};

export default CommentsTab;
