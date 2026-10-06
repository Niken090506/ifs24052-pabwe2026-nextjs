import { useState, type ChangeEvent } from "react";

type InputElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export default function useInput(
  defaultValue = ""
): [string, (event: ChangeEvent<InputElement>) => void, (value: string) => void] {
  const [value, setValue] = useState(defaultValue);

  const onChange = (event: ChangeEvent<InputElement>) => {
    setValue(event.target.value);
  };

  return [value, onChange, setValue];
}
