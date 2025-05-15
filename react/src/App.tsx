import { useEffect, useState, forwardRef, useRef } from "react";
import Demo1 from "./component/Demo1";
import MiniCalendar from "./component/MiniCalendar";
import Calendar2 from "./component/Calendar";
import dayjs from "dayjs";
import { IconAdd, IconEmail } from "./component/Icon/IconAdd";
import Space from "./component/Space";
import WaterMark from "./component/WaterMark";
import Deck from "./pages/GestureDemo";
import { MessageProvide } from "./component/Message";
import { ConfigProvider } from "./component/Message/ConfigProvide";
import { useMessage } from "./component/Message/useMessage";
import { Mask } from "./component/Onboarding/Mask";
import { Popover, Button, Checkbox, Input } from "antd";
import { OnBoarding } from "./component/Onboarding";
import Form from "./component/Form";
const Calendar = forwardRef(MiniCalendar);
function App() {
  const [value, setValue] = useState(() => new Date("2025-5-1"));
  const form = useRef(null);

  function Btn() {
    const message = useMessage();
    return (
      <div
        className="cursor-pointer border-2 w-10"
        onClick={() => {
          message.add({
            content: "请求成功",
            duration: 1000,
          });
        }}
      >
        click
      </div>
    );
  }
  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <ConfigProvider>
      <WaterMark
        content={["test", "test", "test"]}
        getContainer={() => document.body}
      >
        <Calendar
          // defaultValue={new Date("2025-5-4")}
          value={value}
          onChange={(val) => {
            console.log(val);
            setValue(val);
          }}
        ></Calendar>
        <div id="xxxx">
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
                <>
                  <IconEmail style={{ color: "red" }}></IconEmail>
                </>
              );
            }}
          ></Calendar2>
        </div>
        <Space
          id="xxx"
          direction="horizontal"
          align="end"
          size="large"
          wrap={true}
          split={<IconAdd spin={true} size="32"></IconAdd>}
        >
          <div>1</div>
          <div>1</div>
          <div style={{ height: "40px" }}>1</div>
          <div style={{ height: "40px" }}>1</div>
          <div style={{ height: "40px" }}>1</div>
          <div style={{ height: "40px" }}>1</div>
          <div style={{ height: "40px" }}>1</div>
          <div style={{ height: "40px" }}>1</div>
        </Space>
        {/* <Deck></Deck> */}
        <Btn></Btn>
      </WaterMark>
      <OnBoarding
        steps={[
          {
            selector: "xxx",
            renderContent: () => {
              return "111space组件";
            },
            placement: "bottom",
          },
          {
            selector: "xxx",
            renderContent: () => {
              return "222space组件";
            },
            placement: "bottom",
          },
          {
            selector: "xxxx",
            renderContent: () => {
              return "333日历组件";
            },
            placement: "bottom",
          },
          {
            selector: "xxxx",
            renderContent: () => {
              return "4444";
            },
            placement: "bottom",
          },
        ]}
      ></OnBoarding>
      <Form
        initialValues={{ remember: true, username: "test" }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        ref={form}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "请输入用户名!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "请输入密码!" }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>记住我</Checkbox>
        </Form.Item>

        <Form.Item>
          <div>
            <Button type="primary" htmlType="submit">
              登录
            </Button>
          </div>
        </Form.Item>
      </Form>
      <Button
        type="primary"
        onClick={() => {
          console.log(form.current?.getFieldsValue());
        }}
      >
        打印表单值
      </Button>

      <Button
        type="primary"
        onClick={() => {
          form.current?.setFieldsValue({
            username: "东东东",
          });
        }}
      >
        设置表单值
      </Button>
    </ConfigProvider>
  );
}

export default App;
