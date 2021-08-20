import { FC, ReactNode } from "react";
import Button from "../Button/Button";
import StyledConfirmDialog from "./ConfirmDialog.style";
import { ButtonProps } from "../Button/Button";

export type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  message?: string | ReactNode;
  acceptButtonLabel?: string | ReactNode;
  rejectButtonLabel?: string | ReactNode;
  acceptButtonConfig?: ButtonProps;
  rejectButtonConfig?: ButtonProps;
  handleClose?: () => void;
  backdropClick?: () => void;
  onConfirm?: () => void;
  onReject?: () => void;
};

const ConfirmDialog: FC<ConfirmDialogProps> = ({
  title,
  message,
  acceptButtonConfig,
  rejectButtonConfig,
  acceptButtonLabel,
  rejectButtonLabel,
  onConfirm,
  onReject,
  ...rest
}) => {
  return (
    <StyledConfirmDialog {...rest}>
      <h2>{title}</h2>
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
