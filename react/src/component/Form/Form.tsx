import React, {
  ReactNode,
  useState,
  useRef,
  FormEvent,
  forwardRef,
  useImperativeHandle,
} from "react";

import FormContext from "./FormContext";

export interface FormProps extends React.HTMLAttributes<HTMLFormElement> {
  onFinish?: (values: Record<string, any>) => void;
  onFinishFailed?: (errors: Record<string, any>) => void;
  initialValues?: Record<string, any>;
  children?: ReactNode;
}

export interface FormRef {
  getFieldsValue: () => Record<string, any>;
  setFieldsValue: (values: Record<string, any>) => void;
}

const Form = forwardRef<FormRef, FormProps>((props: FormProps, ref) => {
  const { children, onFinish, onFinishFailed, initialValues, ...others } =
    props;

  const [values, setValues] = useState<Record<string, any>>(
    initialValues || {}
  );

  useImperativeHandle(ref, () => {
    return {
      getFieldsValue: () => {
        return values;
      },
      setFieldsValue: (vals) => {
        setValues({ ...values, ...vals });
      },
    };
  });
  const validatorMap = useRef(new Map<string, Function>());

  const errors = useRef<Record<string, any>>({});

  const onValueChange = (key: string, value: any) => {
    values[key] = value;
  };

  const handleValidateRegister = (name: string, cb: Function) => {
    validatorMap.current.set(name, cb);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    for (const [key, cb] of validatorMap.current) {
      if (typeof cb === "function") {
        errors.current[key] = cb();
      }
    }

    const errorList = Object.keys(errors.current)
      .map((key) => {
        return errors.current[key];
      })
      .filter(Boolean);

    if (errorList.length) {
      onFinishFailed?.(errors.current);
    } else {
      onFinish?.(values);
    }
  };

  return (
    <FormContext.Provider
      value={{
        values,
        setValues: (v) => setValues(v),
        onValueChange,
        validateRegister: handleValidateRegister,
      }}
    >
      <form {...others} onSubmit={handleSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  );
});

export default Form;
