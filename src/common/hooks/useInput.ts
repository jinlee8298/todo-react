import { ChangeEventHandler, useState } from "react";

type OptionsType = {
  maxLength?: { value: number; message?: string };
  minLength?: { value: number; message?: string };
  validate?: (changedeValue: string) => {
    valid: boolean;
    errorType: string;
    errorMessage: string;
  }[];
};

export type InputError = {
  [id: string]: string | null;
};

const useInput = <InputType extends HTMLTextAreaElement | HTMLInputElement>(
  initialValue: string,
  options?: OptionsType
) => {
  const [value, setValue] = useState(initialValue);
  const [errors, setErrors] = useState<InputError>({});

  const updateError = (message: string | null, type: string) => {
    if (message && !errors[type]) {
      setErrors((value) => ({
        ...value,
        [type]: message,
      }));
    }
    if (!message && errors[type]) {
      setErrors((value) => ({
        ...value,
        [type]: null,
      }));
    }
  };

  const onChange: ChangeEventHandler<InputType> = (e) => {
    const target = e.target as InputType;

    const inputValue = target.value;
    if (options?.maxLength) {
      updateError(
        inputValue.length > options.maxLength.value
          ? options.maxLength.message ||
              `Maximum character limit exceeded: ${options.maxLength.value}`
          : null,
        "maxLength"
      );
    }
    if (options?.minLength) {
      updateError(
        inputValue.length < options.minLength.value
          ? options.minLength.message ||
              `Maximum character limit exceeded: ${options.minLength.value}`
          : null,
        "minLength"
      );
    }
    if (options?.validate) {
      const validateResults = options.validate(inputValue);
      validateResults.forEach(({ valid, errorType, errorMessage }) => {
        updateError(valid ? null : errorMessage, errorType);
      });
    }

    setValue(inputValue);
  };

  const reset = () => {
    setValue(initialValue);
  };

  return [value, errors, reset, onChange, setValue] as [
    value: string,
    errors: InputError,
    reset: () => void,
    onChange: ChangeEventHandler<InputType>,
    setValue: typeof setValue
  ];
};

export default useInput;
