/*
 * @Author: 1009
 * @Date: 2025-04-27 14:39:51
 * @LastEditors: 1009
 * @LastEditTime: 2025-04-27 16:49:47
 * @Description: mini calendar demo
 */
import React, { useState, useImperativeHandle } from "react";
import { useControllableValue } from "ahooks";
const monthName = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];
interface CalendarProps {
  defaultValue?: Date;
  value?: Date;
  onChange?: (date: Date) => void;
}

interface CalendarRef {
  getDate: () => Date;
  setDate: (date: Date) => void;
}

const MiniCalendar: React.ForwardRefRenderFunction<
  CalendarRef,
  CalendarProps
> = (props: CalendarProps, ref) => {
  const [date, setDate] = useControllableValue(props, {
    defaultValue: new Date(),
  });

  useImperativeHandle(ref, () => {
    return {
      getDate() {
        return date;
      },
      setDate(date: Date) {
        setDate(date);
      },
    };
  });

  const handlePrevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };
  // 获取当前月份有几天
  const daysOfMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // 获取当前月份第一天是周几
  const firstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // 补全上一个月
  const daysOfLastMonth = (year: number, month: number, n: number) => {
    const days = new Date(year, month, 0).getDate();
    return Array.from({ length: n }).map((el, index) => {
      return days - n + index + 1;
    });
  };

  // 补全下一个月
  const daysOfNextMonth = (daysCount: number, firstDay: number) => {
    const total = 42;
    const restDays = total - daysCount - firstDay;
    return Array.from({ length: restDays }).map((el, index) => {
      return index + 1;
    });
  };

  const renderDates = () => {
    const days = [];

    const daysCount = daysOfMonth(date.getFullYear(), date.getMonth());
    const firstDay = firstDayOfMonth(date.getFullYear(), date.getMonth());
    const lastDays = daysOfLastMonth(
      date.getFullYear(),
      date.getMonth(),
      firstDay
    );

    const nextDays = daysOfNextMonth(daysCount, firstDay);
    console.log(lastDays);
    ["日", "一", "二", "三", "四", "五", "六"].forEach((el) => {
      days.push(
        <div key={el} className="w-[calc(100%/7)] text-center leading-[30px] ">
          {el}
        </div>
      );
    });

    lastDays.forEach((el) => {
      days.push(
        <div
          key={`empty-${el}`}
          className="w-[calc(100%/7)] text-center leading-[30px] h-2 text-gray-300"
        >
          {el}
        </div>
      );
    });

    for (let i = 1; i <= daysCount; i++) {
      const clickHandle = () => {
        const curDate = new Date(date.getFullYear(), date.getMonth(), i);
        setDate(curDate);
      };
      if (i === date.getDate()) {
        days.push(
          <div
            key={i}
            onClick={() => clickHandle()}
            className="w-[calc(100%/7)] text-center leading-[30px] bg-gray-200"
          >
            {i}
          </div>
        );
      } else {
        days.push(
          <div
            key={i}
            onClick={() => clickHandle()}
            className="w-[calc(100%/7)] text-center leading-[30px] hover:bg-gray-200 hover:cursor-pointer"
          >
            {i}
          </div>
        );
      }
    }

    nextDays.forEach((el) => {
      days.push(
        <div
          key={`empty-${el}`}
          className="w-[calc(100%/7)] text-center leading-[30px] h-2 text-gray-300"
        >
          {el}
        </div>
      );
    });
    console.log(days);
    return days;
  };
  return (
    <div className="border border-[#aaa] p-4 w-72 h-68">
      <div className="flex justify-between items-center h-10">
        <div
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={handlePrevMonth}
        >
          &lt;
        </div>
        <div>
          {date.getFullYear()}年{monthName[date.getMonth()]}
        </div>
        <div
          onClick={handleNextMonth}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          &gt;
        </div>
      </div>
      <div className="flex flex-wrap">{renderDates()}</div>
    </div>
  );
};

export default MiniCalendar;
