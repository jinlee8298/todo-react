import { useState } from "react";
import { ConfirmDialogProps } from "common/components/ConfirmDialog/ConfirmDialog";

const useConfirmDialog = () => {
  const [dialogProp, setDialogProp] = useState<ConfirmDialogProps>({
    isShown: false,
  });

  const show = (config: Omit<ConfirmDialogProps, "isShown">) => {
    setDialogProp({ ...config, isShown: true });
  };

  const hide = () => {
    setDialogProp((v) => ({ ...v, isShown: false }));
  };

  return [show, hide, dialogProp] as [
    (config: Omit<ConfirmDialogProps, "isShown">) => void,
    () => void,
    ConfirmDialogProps
  ];
};

export default useConfirmDialog;
