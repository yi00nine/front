import React, { forwardRef, PropsWithChildren } from "react";
type BaseIconProps = {
  className?: string;
  style?: React.CSSProperties;
  size?: string | string[];
  spin?: boolean;
};
export type IconProps = BaseIconProps &
  Omit<React.SVGAttributes<SVGElement>, keyof BaseIconProps>;

const getSize = (size: IconProps["size"]) => {
  if (Array.isArray(size) && size.length === 2) {
    return size as string[];
  }

  const width = (size as string) || "1em";
  const height = (size as string) || "1em";

  return [width, height];
};
const Icon = forwardRef<SVGSVGElement, PropsWithChildren<IconProps>>(
  (props, ref) => {
    const { style, spin, size = "1em", children, ...rest } = props;
    const [width, height] = getSize(size);
    return (
      <svg
        ref={ref}
        style={style}
        width={width}
        height={height}
        {...rest}
        fill="currentColor"
        className={`inline-block ${spin && "animate-spin"}`}
      >
        {children}
      </svg>
    );
  }
);

export default Icon;
