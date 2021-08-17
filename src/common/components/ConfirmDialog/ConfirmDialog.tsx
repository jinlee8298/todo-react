import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import Button from "../Button/Button";
import StyledConfirmDialog from "./ConfirmDialog.style";
import { ButtonProps } from "../Button/Button";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  titleIcon?: IconProp;
  message?: string;
  acceptButtonLabel?: string;
  rejectButtonLabel?: string;
  acceptButtonConfig?: ButtonProps;
  rejectButtonConfig?: ButtonProps;
  handleClose?: () => void;
  backdropClick?: () => void;
  onConfirm?: () => void;
  onReject?: () => void;
};

const ConfirmDialog: FC<ConfirmDialogProps> = (props) => {
  const {
    title,
    titleIcon,
    message,
    acceptButtonConfig,
    rejectButtonConfig,
    acceptButtonLabel,
    rejectButtonLabel,
    onConfirm,
    onReject,
    ...rest
  } = props;
  return (
    <StyledConfirmDialog {...rest}>
      <h2>
        {titleIcon && <FontAwesomeIcon icon={titleIcon} />}
        {title}
      </h2>
      <div className="message">{message}</div>
      <div className="action-group">
        <Button
          size="sm"
          alternative="reverse"
          {...rejectButtonConfig}
          onClick={onReject}
        >
          {rejectButtonLabel ?? "No"}
        </Button>
        <Button size="sm" {...acceptButtonConfig} onClick={onConfirm}>
          {acceptButtonLabel ?? "Yes"}
        </Button>
      </div>
    </StyledConfirmDialog>
  );
};

export default ConfirmDialog;
