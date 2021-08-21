import FocusTrap from "focus-trap-react";
import { FC, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import StyledModal from "./Modal.style";

type ModalProps = {
  isShown: boolean;
  handleClose?: () => void;
  backdropClick?: () => void;
};

const Modal: FC<ModalProps> = (props) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (props.isShown) {
      setTimeout(() => {
        sectionRef.current?.classList.add("showing");
      });
      setRender(true);
    } else {
      sectionRef.current?.classList.remove("showing");
      setTimeout(() => setRender(false), 200);
    }
  }, [props.isShown]);

  return render
    ? createPortal(
        <FocusTrap>
          <StyledModal {...props} ref={sectionRef}>
            <div className="backdrop" onClick={props.backdropClick}></div>
            <section>{props.children}</section>
          </StyledModal>
        </FocusTrap>,
        document.body
      )
    : null;
};

export default Modal;
