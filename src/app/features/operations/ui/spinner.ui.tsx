import cn from "classnames";
import { PropsWithChildren, SVGProps } from "react";

export interface SpinnerProps extends SVGProps<SVGSVGElement> {
  size?: "normal" | "small" | "medium" | "large";
}

export const SpinnerUI = ({
  className,
  size = "normal",
  ...props
}: PropsWithChildren<SpinnerProps>) => {
  return (
    <span
      style={{
        animation: "1s linear 0s infinite normal none running spin",
      }}
    >
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        className={cn(
          "animate-spin",
          {
            "h-4 w-4": size === "small",
            "h-5 w-5": size === "normal",
            "h-6 w-6": size === "medium",
            "h-8 w-8": size === "large",
          },
          className,
        )}
        viewBox="0 0 24 24"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
          className="opacity-25"
        />
        <path
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          className="opacity-75"
        />
      </svg>
    </span>
  );
};
