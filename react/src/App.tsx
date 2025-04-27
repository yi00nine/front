import { useEffect, useState, forwardRef } from "react";
import Demo1 from "./component/Demo1";
import MiniCalendar from "./component/MiniCalendar";
const Calendar = forwardRef(MiniCalendar);
function App() {
  const [value, setValue] = useState(() => new Date("2025-5-1"));
  console.log("render app");
  return (
    <>
      {/* <Demo1 defaultValue={new Date("2025-5-1")}></Demo1> */}
      {/* <Demo1 value={value} onChange={setValue}></Demo1> */}
      <Calendar
        // defaultValue={new Date("2025-5-4")}
        value={value}
        onChange={(val) => {
          console.log(val);
          setValue(val);
        }}
      ></Calendar>
    </>
  );
}

export default App;
