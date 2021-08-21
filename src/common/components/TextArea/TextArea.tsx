import {
  FC,
  ChangeEventHandler,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import StyledTextArea from "./TextArea.style";
import { InputError } from "common/hooks/useInput";

export const updateTextareaHeight = (
  textarea: HTMLTextAreaElement,
  lineHeight: number,
  minRows: number,
  maxRows: number
) => {
  // Skrink textarea in case its content shorten
  textarea.style.height = "0px";

  const minHeight = minRows * lineHeight;
  const maxHeight = maxRows;
  const scrollHeight = textarea.scrollHeight;
  // Update textarea's height based on its content
  textarea.style.height = `${
    scrollHeight > maxHeight
      ? maxHeight
      : scrollHeight < minHeight
      ? minHeight
      : scrollHeight
  }px`;
};

type TextAreaProps = JSX.IntrinsicElements["textarea"] & {
  label?: string;
  errors?: InputError;
  hideErrorMessage?: boolean;
  minRows?: number;
  maxRows?: number;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
};

const TextArea: FC<TextAreaProps> = ({
  label,
  errors,
  value,
  hideErrorMessage = false,
  minRows = 1,
  maxRows = null,
  onChange,
  ...rest
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textAreaLineHeight = useRef<number | null>(null);

  const mapError = useMemo(() => {
    return errors ? Object.values(errors).filter((x) => x) : [];
  }, [errors]);

  const getClassName = () => {
    const classArr = [];
    if (value) {
      classArr.push("filled");
    }
    if (mapError.length > 0) {
      classArr.push("error");
    }
    return classArr.join(" ");
  };

  useLayoutEffect(() => {
    if (textareaRef.current) {
      if (!textAreaLineHeight.current) {
        const computedStyle = window.getComputedStyle(textareaRef.current);
        textAreaLineHeight.current = Number(
          computedStyle.lineHeight.replace("px", "")
        );
      }
      const lineHeight = textAreaLineHeight.current;
      updateTextareaHeight(
        textareaRef.current,
        lineHeight,
        minRows,
        maxRows ? maxRows * lineHeight : Number.MAX_SAFE_INTEGER
      );
    }
  }, [value, minRows, maxRows]);

  return (
    <StyledTextArea>
      <span className={"input-wrapper " + getClassName()}>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          {...rest}
        />
        <span className="label">{label}</span>
      </span>
      {!hideErrorMessage &&
        mapError.map((errorMessage) => (
          <p key={errorMessage} className="error-message">
            {errorMessage}
          </p>
        ))}
    </StyledTextArea>
  );
};

export default TextArea;
