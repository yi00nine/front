/*
 * @Author: 1009
 * @Date: 2025-05-09 11:23:47
 * @LastEditors: 1009
 * @LastEditTime: 2025-05-09 17:39:37
 * @Description: message 组件
 */
import React, {
  useEffect,
  useRef,
  useMemo,
  useImperativeHandle,
  forwardRef,
} from "react";
import { createPortal } from "react-dom";
import useStore from "./UseStore";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./index.css";
import { useTimer } from "./useTimer";
export type Position = "top" | "bottom";
export interface MessageProps {
  content: React.ReactNode;
  duration?: number;
  id?: number;
  position?: Position;
}

const MessageItem = (item) => {
  const { onMouseEnter, onMouseLeave } = useTimer({
    id: item.id!,
    duration: item.duration,
    remove: item.onClose!,
  });

  return (
    <div
      className="message-item"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {item.content}
    </div>
  );
};

export interface MessageRef {
  add: (messageProps: MessageProps) => number;
}
export const MessageProvider = forwardRef<MessageRef>((props, ref) => {
  const position = "top";
  const { messageList, add, remove } = useStore(position);
  const nodeRefs = useRef(new Map());
  useImperativeHandle(ref, () => {
    return {
      add,
    };
  });
  const positions = Object.keys(messageList) as Position[];
  const messageWrapper = (
    <div className="message-wrapper">
      {positions.map((direction) => {
        return (
          <TransitionGroup
            className={`message-wrapper-${direction}`}
            key={direction}
          >
            {messageList[direction].map((item) => {
              if (!nodeRefs.current.has(item.id)) {
                nodeRefs.current.set(item.id, React.createRef());
              }
              return (
                <CSSTransition
                  nodeRef={nodeRefs.current.get(item.id)}
                  key={item.id}
                  timeout={1000}
                  classNames="message"
                >
                  <MessageItem onClose={remove} {...item}></MessageItem>
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        );
      })}
    </div>
  );

  const el = useMemo(() => {
    const el = document.createElement("div");
    el.className = `wrapper`;

    document.body.appendChild(el);
    return el;
  }, []);
  return createPortal(messageWrapper, el);
});
