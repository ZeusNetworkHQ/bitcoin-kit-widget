import { useState } from "react";

import BigNumber from "bignumber.js";

export interface NumberInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "defaultValue" | "onChange" | "max" | "min"
  > {
  value?: number | BigNumber | string;
  defaultValue?: number | BigNumber | string;
  max?: number | BigNumber | string;
  min?: number | BigNumber | string;
  decimal?: number;
  onChange?: (value: BigNumber) => void;
}

function NumberInput({
  value = 0,
  max,
  min,
  decimal,
  defaultValue = value ?? 0,
  onChange,
  onBlur,
  ...props
}: NumberInputProps) {
  const [inputText, setInputText] = useState(() => {
    if (new BigNumber(defaultValue).isZero()) return "";
    return new BigNumber(defaultValue).toFixed();
  });

  const getCurrentValueInString = () => {
    const currentValue = new BigNumber(value ?? 0);
    if (decimal !== undefined)
      return new BigNumber(currentValue.toFixed(decimal)).toFixed();
    if (currentValue.isZero()) return "";
    return currentValue.toFixed();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const getValue = (inputText: string) => {
      const parsedValue = new BigNumber(inputText || defaultValue);

      if (parsedValue.isNaN()) return new BigNumber(defaultValue);
      if (max !== undefined && parsedValue.gt(max)) return new BigNumber(max);
      if (min !== undefined && parsedValue.lt(min)) return new BigNumber(min);
      return parsedValue;
    };

    setInputText(event.target.value);

    const newValue = getValue(event.target.value);
    if (onChange && !newValue.eq(value)) onChange?.(newValue);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    onBlur?.(event);
    if (event.target.value === "") {
      setInputText("");
      onChange?.(new BigNumber(0));
      return;
    }
    const stringValue = getCurrentValueInString();
    setInputText(stringValue);
    onChange?.(new BigNumber(stringValue));
  };

  return (
    <input
      {...props}
      value={inputText}
      placeholder="0"
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}

export default NumberInput;
