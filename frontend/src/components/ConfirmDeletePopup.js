import React from 'react';
import PopupWithForm from "./PopupWithForm";

function ConfirmDeletePopup({ isOpen, onClose, isDataLoad, card, onDeleteCard }) {

  function handleSubmit(e) {
    e.preventDefault();
    onDeleteCard(card);
  }

  return (
    <PopupWithForm
      name="confirmDeleteCard"
      id="confirm"
      title="Вы уверены?"
      isOpen={isOpen}
      onClose={onClose}
      submitText={isDataLoad ? 'Удаляем...' : 'Да'}
      onSubmit={handleSubmit}
    />
  )
}

export default ConfirmDeletePopup;