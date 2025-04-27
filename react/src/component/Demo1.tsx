/*
 * @Author: 1009
 * @Date: 2025-04-27 10:41:00
 * @LastEditors: 1009
 * @LastEditTime: 2025-04-27 11:23:43
 * @Description: 组件的受控和非受控模式
 */
import { useState, useEffect, useRef } from "react";

interface CalendarProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
}

function Calendar(props: CalendarProps) {
  console.log("render");
  const { value: propsValue, defaultValue, onChange } = props;
  const isFirstRender = useRef(true);
  const [value, setValue] = useState(() => {
    if (propsValue !== undefined) {
      return propsValue;
    } else {
      return defaultValue;
    }
  });

  useEffect(() => {
    if (propsValue === undefined && !isFirstRender.current) {
      setValue(propsValue);
    }
    isFirstRender.current = false;
  }, [propsValue]);

  const mergedValue = propsValue === undefined ? value : propsValue;

  const changeValue = (date: Date) => {
    if (propsValue === undefined) {
      setValue(date);
    } else {
      onChange?.(date);
    }
  };

  return (
    <div>
      {mergedValue?.toLocaleDateString()}
      <div
        onClick={() => {
          changeValue(new Date("2024-5-1"));
        }}
      >
        2023-5-1
      </div>
      <div
        onClick={() => {
          changeValue(new Date("2024-5-2"));
        }}
      >
        2023-5-2
      </div>
      <div
        onClick={() => {
          changeValue(new Date("2024-5-3"));
        }}
      >
        2023-5-3
      </div>
    </div>
  );
}

export default Calendar;
