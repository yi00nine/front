/*
 * @Author: 1009
 * @Date: 2025-05-09 17:08:20
 * @LastEditors: 1009
 * @LastEditTime: 2025-05-09 18:01:56
 * @Description: 文件描述
 */
import {
  PropsWithChildren,
  RefObject,
  createContext,
  useRef,
  useEffect,
  useState,
} from "react";
import { MessageProvider, MessageRef } from ".";
interface ConfigProviderProps {
  messageRef?: RefObject<MessageRef>;
}
export const ConfigContext = createContext<ConfigProviderProps>({});

export function ConfigProvider(props: PropsWithChildren) {
  const { children } = props;
  const [isReady, setIsReady] = useState(false); // 新增状态

  useEffect(() => {
    setIsReady(true);
  }, []);
  const messageRef = useRef<MessageRef>(null);

  return (
    <ConfigContext.Provider value={{ messageRef }}>
      <MessageProvider ref={messageRef}></MessageProvider>
      {isReady ? children : null}
    </ConfigContext.Provider>
  );
}
