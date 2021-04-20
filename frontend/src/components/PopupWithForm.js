import React, { useEffect } from "react";

function PopupWithForm({ id, isOpen, name, children, title, onClose, onSubmit, submitText, isDisabled }) {

  useEffect(() => {
    if (!isOpen) return;
    const handleEscapeClose = (evt) => {
      if (evt.key === 'Escape') {
        onClose()
      };
    };
    document.addEventListener('keyup', handleEscapeClose);
    return () => {
      document.removeEventListener('keyup', handleEscapeClose);
    };
  }, [isOpen, onClose])

  return (
    <div id={id} className={`popup ${isOpen && 'popup_opened'}`}>
      <form name={name} className="popup__form" onSubmit={onSubmit} noValidate>
        <fieldset className="popup__set">
          <p className="popup__title">{title}</p>
          {children}
          <button type="submit" className={`popup__button ${isDisabled && "popup__button_disabled"}`} disabled={isDisabled}>
            {submitText}
          </button>
        </fieldset>
        <button type="button" onClick={onClose} className="popup__close-button"></button>
      </form>
      <div onClick={onClose} className="popup__overlay"></div>
    </div>
  );
}

export default PopupWithForm;
