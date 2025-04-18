import { useEffect, useState } from "react";

async function queryData() {
  console.log("queryData");
  const data = await new Promise<number>((resolve) => {
    setTimeout(() => {
      resolve(666);
    }, 2000);
  });
  return data;
}
function App() {
  const [num, setNum] = useState(0);

  useEffect(() => {
    queryData().then((data) => {
      setNum(data);
    });
  }, []);
  return (
    <>
      <div className="text-3xl font-bold underline">{num}</div>
    </>
  );
}

export default App;
