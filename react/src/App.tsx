/*
 * @Author: 1009
 * @Date: 2025-04-17 17:17:19
 * @LastEditors: 1009
 * @LastEditTime: 2025-04-30 11:14:28
 * @Description: 文件描述
 */
import { useEffect, useState, forwardRef } from "react";
import Demo1 from "./component/Demo1";
import MiniCalendar from "./component/MiniCalendar";
import Calendar2 from "./component/Calendar";
import dayjs from "dayjs";

import { IconAdd, IconEmail } from "./component/Icon/IconAdd";

import Space from "./component/Space";
const Calendar = forwardRef(MiniCalendar);
function App() {
  const [value, setValue] = useState(() => new Date("2025-5-1"));
  console.log("render app");
  return (
    <>
      {/* <Demo1 defaultValue={new Date("2025-5-1")}></Demo1> */}
      {/* <Demo1 value={value} onChange={setValue}></Demo1> */}
      {/* <Calendar
        // defaultValue={new Date("2025-5-4")}
        value={value}
        onChange={(val) => {
          console.log(val);
          setValue(val);
        }}
      ></Calendar> */}
      {/* <Calendar2
        defaultValue={dayjs("2025-05-01")}
        // dateRender={(value) => {
        //   return (
        //     <div>
        //       <p className="h-14 text-blue-500 bg-green-200">
        //         {value.format("YYYY*MM*DD")}
        //       </p>
        //     </div>
        //   );
        // }}
        dateInnerContent={(value) => {
          return (
            <>
              <IconAdd spin={true} size="32"></IconAdd>
              <IconEmail style={{ color: "red" }}></IconEmail>
            </>
          );
        }}
      ></Calendar2> */}
      <Space
        direction="horizontal"
        align="end"
        size="large"
        wrap={true}
        split={<IconAdd spin={true} size="32"></IconAdd>}
      >
        <div>1</div>
        <div>1</div>
        <div style={{ height: "40px" }}>1</div>
      </Space>
    </>
  );
}

export default App;
