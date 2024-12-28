import { useState } from "react";

export function useBoolean(defaultValue = false) {
  const [value, setValue] = useState(defaultValue);

  const toggle = () => setValue((prev) => !prev);
  const setFalse = () => setValue(false);
  const setTrue = () => setValue(true);

  return { value, toggle, setFalse, setTrue };
}
