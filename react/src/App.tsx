import { useEffect, useState } from "react";
import Demo1 from "./component/Demo1";

function App() {
  const [value, setValue] = useState(() => new Date("2025-5-1"));
  console.log("render app");
  return (
    <>
      {/* <Demo1 defaultValue={new Date("2025-5-1")}></Demo1> */}
      <Demo1 value={value} onChange={setValue}></Demo1>
    </>
  );
}

export default App;
