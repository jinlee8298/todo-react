import { useContext, MouseEventHandler, forwardRef } from "react";
import { ThemeContext } from "styled-components";
import StyledButton from "./Button.style";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

type ButtonProps = {
  variant?: "primary" | "success" | "danger" | "warning" | "info";
  size?: "sx" | "sm" | "md" | "lg";
  icon?: IconProp;
  onClick?: MouseEventHandler;
  alternative?: "outline" | "reverse";
  disabled?: boolean;
  title?: string;
  rounded?: boolean;
  iconPosition?: "start" | "end";
} & JSX.IntrinsicElements["button"];

const SIZE_MAPPING = {
  sx: "0.5rem",
  sm: "0.6875rem",
  md: "0.875rem",
  lg: "1rem",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    variant,
    size,
    alternative,
    icon,
    children,
    rounded,
    iconPosition = "start",
    ref: _ref,
    ...rest
  } = props;
  const themeContext = useContext(ThemeContext);

  return (
    <StyledButton
      mainColor={themeContext[variant ?? "primary"]}
      textColor={"white"}
      size={SIZE_MAPPING[size ?? "md"]}
      className={[alternative, !children ? "icon-button" : ""].join(" ")}
      ref={ref}
      rounded={!!rounded}
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
});

export default Button;
