import React, {
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

const ModalContext = createContext();

const Modal = ({ children, openButtonTitle }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false); //Will animate while the isModalOpen is changing to false

  const openModal = () => {
    setIsModalOpen(true);
    setTimeout(() => {
      setIsExiting(false);
    }, 300); //setTimeout added so modal can fade out.
  };

  const closeModal = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsExiting(false);
    }, 300); //same reason for setTimeout here.
  };

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal, isModalOpen, isExiting }}
    >
      <button className="open-btn" onClick={openModal}>
        {openButtonTitle}
      </button>
      <Window>
        {/* DO NOT change this React Fragment to any other tag (like a div or a span). Doing so will close the modal on a click inside of it */}
        <>{children}</>
      </Window>
    </ModalContext.Provider>
  );
};

function Window({ children }) {
  const { isModalOpen, closeModal, isExiting } = useContext(ModalContext);

  // This ref determines if a click occured inside or outside the modal.
  const ref = useRef();

  //Closing the modal when user clicks outside of it.
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        closeModal();
      }
    }

    //Closing the modal when user pressed the Esc key.
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        closeModal();
      }
    }

    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeModal]);

  if (!isModalOpen) return null;

  // createPortal will shift the div to any DOM node we want, in this case, the body tag
  return createPortal(
    <div className="overlay" aria-hidden={!isModalOpen}>
      <div className={`modal ${isExiting ? "fade-out" : ""}`} ref={ref}>
        <button className="close-btn" onClick={closeModal} aria-label="Close">
          X
        </button>
        <div>{cloneElement(children, { onClick: closeModal })}</div>
      </div>
    </div>,
    document.body //target DOM node
  );
}

export default Modal;
