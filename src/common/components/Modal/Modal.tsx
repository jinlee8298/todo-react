import FocusTrap from "focus-trap-react";
import {
  FC,
  KeyboardEventHandler,
  MouseEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import StyledModal from "./Modal.style";

type ModalProps = {
  isShown: boolean;
  onKeyDown?: KeyboardEventHandler;
  backdropClick?: MouseEventHandler;
};

const Modal: FC<ModalProps> = ({
  isShown,
  children,
  onKeyDown,
  backdropClick,
  ...props
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (isShown) {
      setTimeout(() => {
        sectionRef.current?.classList.add("showing");
      });
      setRender(true);
    } else {
      sectionRef.current?.classList.remove("showing");
      setTimeout(() => setRender(false), 200);
    }
  }, [isShown]);

  const stopPropagation: MouseEventHandler = (e) => {
    e.stopPropagation();
  };
  return render
    ? createPortal(
        <FocusTrap>
          <StyledModal
            onKeyDown={onKeyDown}
            {...props}
            onClick={stopPropagation}
            ref={sectionRef}
          >
            <div className="backdrop" onClick={backdropClick}></div>
            <section>{children}</section>
          </StyledModal>
        </FocusTrap>,
        document.getElementById("modal-container") || document.body
      )
    : null;
};

export default Modal;
