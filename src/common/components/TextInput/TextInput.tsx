import StyledTextInput from "./TextInput.style";
import { ChangeEventHandler, FC, useMemo } from "react";
import { InputError } from "common/hooks/useInput";

type TextInputProps = JSX.IntrinsicElements["input"] & {
  label?: string;
  errors?: InputError;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  hideErrorMessage?: boolean;
};

const TextInput: FC<TextInputProps> = ({
  value,
  errors,
  label,
  hideErrorMessage = false,
  onChange,
  ...rest
}) => {
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

  return (
    <StyledTextInput>
      <span className={"input-wrapper " + getClassName()}>
        <input type="text" value={value} onChange={onChange} {...rest} />
        <span className="label">{label}</span>
      </span>
      {!hideErrorMessage &&
        mapError.map((errorMessage) => (
          <p key={errorMessage} className="error-message">
            {errorMessage}
          </p>
        ))}
    </StyledTextInput>
  );
};

export default TextInput;
