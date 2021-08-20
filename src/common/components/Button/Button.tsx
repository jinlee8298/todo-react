import { useContext, forwardRef, ComponentPropsWithoutRef } from "react";
import { ThemeContext } from "styled-components";
import StyledButton from "./Button.style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export type ButtonProps = {
  variant?: "primary" | "success" | "danger" | "warning" | "info";
  size?: "sx" | "sm" | "md" | "lg";
  icon?: IconProp;
  alternative?: "outline" | "reverse";
  disabled?: boolean;
  rounded?: boolean;
  iconPosition?: "start" | "end";
} & ComponentPropsWithoutRef<"button">;

const SIZE_MAPPING = {
  sx: "0.5rem",
  sm: "0.6875rem",
  md: "0.875rem",
  lg: "1rem",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      alternative,
      icon,
      children,
      rounded,
      iconPosition = "start",
      className,
      ...rest
    },
    ref
  ) => {
    const themeContext = useContext(ThemeContext);

    return (
      <StyledButton
        mainColor={themeContext[variant]}
        textColor={"white"}
        size={SIZE_MAPPING[size]}
        className={[
          alternative,
          !children ? "icon-button" : "",
          className,
        ].join(" ")}
        rounded={!!rounded}
        ref={ref}
        {...rest}
      >
        {icon && iconPosition === "start" && (
          <FontAwesomeIcon icon={icon} fixedWidth />
        )}
        {children && <span>{children}</span>}
        {icon && iconPosition === "end" && (
          <FontAwesomeIcon icon={icon} fixedWidth />
        )}
      </StyledButton>
    );
  }
);

export default Button;
