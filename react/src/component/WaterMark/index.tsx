/*
 * @Author: 1009
 * @Date: 2025-04-30 16:33:16
 * @LastEditors: 1009
 * @LastEditTime: 2025-04-30 17:44:24
 * @Description: 水印组件
 */
import {
  useRef,
  PropsWithChildren,
  CSSProperties,
  FC,
  useCallback,
  useEffect,
} from "react";
import useWatermark from "./useWaterMark";
export interface WatermarkProps extends PropsWithChildren {
  style?: CSSProperties;
  className?: string;
  zIndex?: string | number;
  width?: number;
  height?: number;
  rotate?: number;
  image?: string;
  content?: string | string[];
  fontStyle?: {
    color?: string;
    fontFamily?: string;
    fontSize?: number | string;
    fontWeight?: number | string;
  };
  gap?: [number, number];
  offset?: [number, number];
  getContainer?: () => HTMLElement;
}

const WaterMark: FC<WatermarkProps> = (props) => {
  const {
    className,
    style,
    zIndex,
    width,
    height,
    rotate,
    image,
    content,
    fontStyle,
    gap,
    offset,
    getContainer,
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const getContainerHandle = useCallback(() => {
    return getContainer ? getContainer() : containerRef.current!;
  }, [getContainer]);

  const { generateWatermark } = useWatermark({
    zIndex,
    width,
    height,
    rotate,
    image,
    content,
    fontStyle,
    gap,
    offset,
    getContainer: getContainerHandle,
  });

  useEffect(() => {
    generateWatermark({
      zIndex,
      width,
      height,
      rotate,
      image,
      content,
      fontStyle,
      gap,
      offset,
      getContainer: getContainerHandle,
    });
  }, [
    zIndex,
    width,
    height,
    rotate,
    image,
    content,
    JSON.stringify(props.fontStyle),
    JSON.stringify(props.gap),
    JSON.stringify(props.offset),
    getContainerHandle,
  ]);

  return props.children ? (
    <div ref={containerRef} className={className} style={style}>
      {props.children}
    </div>
  ) : null;
};

export default WaterMark;
