/*
 * @Author: 1009
 * @Date: 2025-04-28 10:08:02
 * @LastEditors: 1009
 * @LastEditTime: 2025-04-29 10:47:21
 * @Description: 完整日历组件
 */
import dayjs, { Dayjs } from "dayjs";
import { ReactNode, useState } from "react";
import { useControllableValue } from "ahooks";
interface CalendarProps {
  value?: Dayjs;
  defaultValue?: Dayjs;
  dateRender?: (currentDate: Dayjs) => ReactNode;
  dateInnerContent?: (currentDate: Dayjs) => ReactNode;
  onChange?: (date: Dayjs) => void;
}

interface MonthCalendarProps extends CalendarProps {
  selectHandler?: (date: Dayjs) => void;
  curMonth: Dayjs;
  value: Dayjs;
}

interface HeaderCalendarProps {
  curMonth: Dayjs;
  preMonthHandler: () => void;
  nextMonthHandler: () => void;
  todayHandler: () => void;
}

const getAlldays = (value: Dayjs) => {
  const startDate = value.startOf("month");
  const day = startDate.day();
  const daysInfo: Array<{ date: Dayjs; currentMonth: boolean }> = new Array(
    6 * 7
  );
  for (let i = 0; i < day; i++) {
    daysInfo[i] = {
      date: startDate.subtract(day - i, "day"),
      currentMonth: false,
    };
  }

  for (let i = day; i < daysInfo.length; i++) {
    const calcDate = startDate.add(i - day, "day");
    daysInfo[i] = {
      date: calcDate,
      currentMonth: calcDate.month() === value.month(),
    };
  }
  return daysInfo;
};

const renderDays = (
  days: Array<{ date: Dayjs; currentMonth: boolean }>,
  dateRender: CalendarProps["dateRender"],
  dateInnerContent: CalendarProps["dateInnerContent"],
  value: Dayjs,
  selectHandler: MonthCalendarProps["selectHandler"]
) => {
  const rows = [];

  for (let i = 0; i < 6; i++) {
    const row = [];
    for (let j = 0; j < 7; j++) {
      const item = days[i * 7 + j];
      row[j] = (
        <div
          onClick={() => selectHandler?.(item.date)}
          className={`flex-1  border border-solid border-gray-200 overflow-hidden ${
            item.currentMonth ? "text-black" : "text-gray-300"
          }`}
        >
          {dateRender ? (
            dateRender(item.date)
          ) : (
            <div>
              <div className="p-2.5">
                <div
                  className={`${
                    value?.format("YYYY-MM-DD") ===
                    item.date.format("YYYY-MM-DD")
                      ? "bg-blue-500 w-7 h-7 leading-7 text-center text-white rounded-full cursor-pointer"
                      : "w-7 h-7"
                  }`}
                >
                  {item.date.date()}
                </div>
              </div>
              <div>{dateInnerContent?.(item.date)}</div>
            </div>
          )}
        </div>
      );
    }
    rows.push(row);
  }
  return rows.map((row) => <div className="flex h-24">{row}</div>);
};
const MonthCalendar = (props: MonthCalendarProps) => {
  const { dateRender, dateInnerContent, value, selectHandler, curMonth } =
    props;
  const weekList = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  const allDays = getAlldays(curMonth);
  return (
    <div>
      <div className="flex p-0 w-full border-b border-gray-300">
        {weekList.map((week) => (
          <div className="p-5 px-4 text-left text-gray-500 flex-1" key={week}>
            {week}
          </div>
        ))}
      </div>
      <div>
        {renderDays(
          allDays,
          dateRender,
          dateInnerContent,
          value,
          selectHandler
        )}
      </div>
    </div>
  );
};
const HeaderCalender = (props: HeaderCalendarProps) => {
  const { preMonthHandler, nextMonthHandler, curMonth, todayHandler } = props;
  return (
    <div>
      <div className="flex items-center h-7 leading-7">
        <div
          onClick={preMonthHandler}
          className="w-7 h-7 leading-7 rounded-full text-center text-xs select-none cursor-pointer mr-3 hover:bg-gray-300 first:ml-0"
        >
          &lt;
        </div>
        <div className="text-2xl">{curMonth.format("YYYY年MM月")}</div>
        <div
          onClick={nextMonthHandler}
          className="w-7 h-7 leading-7 rounded-full text-center text-xs select-none cursor-pointer mr-3 hover:bg-gray-300 first:ml-0"
        >
          &gt;
        </div>
        <button
          onClick={todayHandler}
          className="bg-gray-200 hover:bg-gray-400 cursor-pointer leading-7 border-0 px-4"
        >
          今天
        </button>
      </div>
    </div>
  );
};

const Calendar = (props: CalendarProps) => {
  const { onChange, value } = props;

  // 适配受控非受控
  const [curValue, setCurValue] = useControllableValue<Dayjs>(props, {
    defaultValue: dayjs(),
  });

  const [curMonth, setCurMonth] = useState<Dayjs>(curValue);
  const changeDate = (date: Dayjs) => {
    onChange?.(date);
    setCurValue(date);
    setCurMonth(date);
  };
  const selectHandler = (date: Dayjs) => {
    changeDate(date);
  };

  const preMonthHandler = () => {
    setCurMonth(curMonth.subtract(1, "month"));
  };
  const nextMonthHandler = () => {
    setCurMonth(curMonth.add(1, "month"));
  };

  const todayHandler = () => {
    const date = dayjs(Date.now());
    changeDate(date);
  };
  return (
    <div className="w-full h-7">
      <HeaderCalender
        curMonth={curMonth}
        preMonthHandler={preMonthHandler}
        nextMonthHandler={nextMonthHandler}
        todayHandler={todayHandler}
      ></HeaderCalender>
      <MonthCalendar
        {...props}
        selectHandler={selectHandler}
        value={curValue}
        curMonth={curMonth}
      ></MonthCalendar>
    </div>
  );
};

export default Calendar;
