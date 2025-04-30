/*
 * @Author: 1009
 * @Date: 2025-04-30 09:50:10
 * @LastEditors: 1009
 * @LastEditTime: 2025-04-30 11:12:49
 * @Description: 文件描述
 */
import React, { useMemo } from "react";

type SizeType = "small" | "middle" | "large" | number | undefined;
interface SpaceProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  style?: React.CSSProperties;
  size?: SizeType;
  direction?: "horizontal" | "vertical";
  align?: "center" | "end" | "start" | "baseline";
  split?: React.ReactNode;
  wrap?: boolean;
}

const Space: React.FC<SpaceProps> = (props) => {
  const { style, direction, align, size, wrap, split, ...rest } = props;
  const alignmentClasses = {
    center: "items-center",
    end: "items-end",
    start: "items-start",
    baseline: "items-baseline",
  };
  const spaceSize = {
    small: 8,
    middle: 16,
    large: 24,
  };
  const getSize = (size: SizeType) => {
    return typeof size === "string" ? spaceSize[size] : size || 0;
  };
  const otherStyles: React.CSSProperties = {};

  otherStyles.columnGap = getSize(size);
  otherStyles.rowGap = getSize(size);
  if (wrap) {
    otherStyles.flexWrap = "wrap";
  }
  const childNodes = React.Children.toArray(props.children);
  const nodes = childNodes.map((child, index) => {
    const key = (child && child.key) || `space-item${index}`;
    return (
      <>
        <div key={key}> {child}</div>
        {index < childNodes.length && split && (
          <span key={index}> {split}</span>
        )}
      </>
    );
  });
  return (
    <div
      style={{ ...style, ...otherStyles }}
      {...rest}
      className={`inline-flex ${direction === "vertical" ? "flex-col" : ""} ${
        alignmentClasses[align ?? "center"]
      } `}
    >
      {nodes}
    </div>
  );
};

export default Space;
