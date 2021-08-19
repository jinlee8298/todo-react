import { ChangeEventHandler, useState } from "react";

type OptionsType = {
  validate?: (changedeValue: string) => {
    valid: boolean;
    errorType: string;
    errorMessage: string;
  }[];
};

type InputError = {
  [id: string]: { type: string; message: string } | undefined;
};

const useInput = <InputType extends HTMLTextAreaElement | HTMLInputElement>(
  initialValue: string,
  options?: OptionsType
) => {
  const [value, setValue] = useState(initialValue);
  const [errors, setErrors] = useState<InputError>({});

  const onChange: ChangeEventHandler<InputType> = (e) => {
    const target = e.target as InputType;

    const inputValue = target.value;

    if (options?.validate) {
      const validateResults = options.validate(inputValue);
      validateResults.forEach(({ valid, errorType, errorMessage }) => {
        const currentError = errors[errorType];
        if (!valid && !currentError) {
          setErrors((value) => ({
            ...value,
            [errorType]: { type: errorType, message: errorMessage },
          }));
        }
        if (valid && currentError) {
          setErrors((value) => {
            value[errorType] = undefined;
            return {
              ...value,
            };
          });
        }
      });
    }

    setValue(inputValue);
  };

  const reset = () => {
    setValue(initialValue);
  };

  return [value, errors, reset, onChange] as [
    string,
    InputError,
    () => void,
    ChangeEventHandler<InputType>
  ];
};

export default useInput;
