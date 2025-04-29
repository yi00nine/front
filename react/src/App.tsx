/*
 * @Author: 1009
 * @Date: 2025-04-17 17:17:19
 * @LastEditors: 1009
 * @LastEditTime: 2025-04-29 10:44:42
 * @Description: 文件描述
 */
import { useEffect, useState, forwardRef } from "react";
import Demo1 from "./component/Demo1";
import MiniCalendar from "./component/MiniCalendar";
import Calendar2 from "./component/Calendar";
import dayjs from "dayjs";
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
      <Calendar2
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
            <div>
              <p>hello</p>
            </div>
          );
        }}
      ></Calendar2>
    </>
  );
}

export default App;
