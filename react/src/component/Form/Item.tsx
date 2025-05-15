import React, { useState, useContext, useEffect, ChangeEvent } from "react";
import FormContext from "./FormContext";

export interface ItemProps {
  label?: string;
  name?: string;
  rules?: Array<Record<string, any>>;
  children?: React.ReactElement;
  valuePropName?: string;
}

const getValueFromEvent = (e: ChangeEvent<HTMLInputElement>) => {
  const { target } = e;
  if (target.type === "checkbox") {
    return target.checked;
  }
  return target.value;
};
const Item = (props: ItemProps) => {
  const { label, name, rules, children, valuePropName } = props;

  const [value, setValue] = useState<string | boolean>();
  const [error, setError] = useState("");
  const { onValueChange, values, validateRegister } = useContext(FormContext);

  useEffect(() => {
    if (value !== values?.[name]) {
      setValue(values?.[name]);
    }
  }, [values, values?.[name]]);

  const propsName: Record<string, any> = {};
  if (valuePropName) {
    propsName[valuePropName] = value;
  } else {
    propsName.value = value;
  }
  const handleValidate = (value) => {
    let errMsg;
    if (Array.isArray(rules) && rules.length) {
      rules.forEach((el) => {
        if (el.required) {
          if (!value) {
            setError(el.message);
            errMsg = el.message;
          } else {
            setError("");
            errMsg = null;
          }
        } else {
          setError("");
          errMsg = null;
        }
      });
    }
    return errMsg;
  };

  useEffect(() => {
    validateRegister?.(name, () => handleValidate(value));
  }, [value]);

  const childEle =
    React.Children.toArray(children).length > 1
      ? children
      : React.cloneElement(children!, {
          ...propsName,
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            const value = getValueFromEvent(e);
            setValue(value);
            onValueChange?.(name, value);
            handleValidate(value);
          },
        });

  return (
    <div>
      <div>{label && <label>{label}</label>}</div>
      <div>
        {childEle}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
    </div>
  );
};

export default Item;
