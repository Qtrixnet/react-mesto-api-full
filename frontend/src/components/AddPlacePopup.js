import React, { useEffect } from 'react';
import PopupWithForm from "./PopupWithForm";
import { useFormWithValidation } from '../hooks/useForm';

function AddPlacePopup({ isOpen, onClose, onAddCard, isDataLoad }) {
  const { values, errors, isValid, handleChange, resetForm } = useFormWithValidation();

  function handleSubmit(e) {
    e.preventDefault();
    //* Передаём значения управляемых компонентов во внешний обработчик
    onAddCard(values);
  }

  useEffect(() => {
    resetForm();
  }, [isOpen, resetForm]);

  return (
    <PopupWithForm
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      name="newCard"
      id="addCard"
      title="Новое место"
      submitText={isDataLoad ? 'Добавляем...' : 'Добавить карточку'}
      isDisabled={!isValid}
    >
      <label className="popup__form-field">
        <input
          value={values.name || ""} onChange={handleChange}
          name="name"
          className="popup__input"
          id="popup__placeName-input"
          required
          minLength="1"
          maxLength="30"
          placeholder="Название карточки"
          type="text"
        />
        <span
          id="popup__placeName-input-error"
          className={`${errors.name ? 'popup__input-error popup__input-error_visible' : 'popup__input-error'}`}
        >{errors.name}</span>
      </label>
      <label className="popup__form-field">
        <input
          value={values.link || ""} onChange={handleChange}
          name="link"
          className="popup__input"
          id="popup__placeLink-input"
          required
          placeholder="Ссылка на картинку"
          type="url"
        />
        <span
          id="popup__placeLink-input-error"
          className={`${errors.link ? 'popup__input-error popup__input-error_visible' : 'popup__input-error'}`}
        >{errors.link}</span>
      </label>
    </PopupWithForm>
  )
}

export default AddPlacePopup;