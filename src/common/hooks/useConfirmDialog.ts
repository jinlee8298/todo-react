import { useState } from "react";
import { ConfirmDialogProps } from "common/components/ConfirmDialog/ConfirmDialog";

const useConfirmDialog = () => {
  const [dialogProp, setDialogProp] = useState<ConfirmDialogProps>({
    open: false,
  });

  const configDialog = (config: Omit<ConfirmDialogProps, "open">) => {
    const openState = dialogProp.open;

    setDialogProp({ ...config, open: openState });
  };

  const show = () => {
    setDialogProp((v) => ({ ...v, open: true }));
  };

  const hide = () => {
    setDialogProp((v) => ({ ...v, open: false }));
  };

  return [show, hide, configDialog, dialogProp] as [
    () => void,
    () => void,
    (config: Omit<ConfirmDialogProps, "open">) => void,
    ConfirmDialogProps
  ];
};

export default useConfirmDialog;
