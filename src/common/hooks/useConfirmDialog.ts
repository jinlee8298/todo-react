import { useState } from "react";
import { ConfirmDialogProps } from "common/components/ConfirmDialog/ConfirmDialog";

const useConfirmDialog = () => {
  const [dialogProp, setDialogProp] = useState<ConfirmDialogProps>({
    open: false,
  });

  const show = (config: Omit<ConfirmDialogProps, "open">) => {
    setDialogProp({ ...config, open: true });
  };

  const hide = () => {
    setDialogProp((v) => ({ ...v, open: false }));
  };

  return [show, hide, dialogProp] as [
    (config: Omit<ConfirmDialogProps, "open">) => void,
    () => void,
    ConfirmDialogProps
  ];
};

export default useConfirmDialog;
