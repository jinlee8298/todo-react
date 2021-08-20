import {
  FC,
  ChangeEventHandler,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import StyledTextArea from "./TextArea.style";
import { InputError } from "common/hooks/useInput";

type TextAreaProps = JSX.IntrinsicElements["textarea"] & {
  label?: string;
  errors?: InputError;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  hideErrorMessage?: boolean;
};

const TextArea: FC<TextAreaProps> = ({
  label,
  errors,
  value,
  hideErrorMessage = false,
  onChange,
  ...rest
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      updateTextareaHeight(textareaRef.current);
    }
  }, [value]);

  const updateTextareaHeight = (textarea: HTMLTextAreaElement) => {
    // Skrink textarea in case its content shorten
    textarea.style.height = "0px";
    // Update textarea's height based on its content
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

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
