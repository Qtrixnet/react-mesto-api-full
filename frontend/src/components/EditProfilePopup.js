import React, { useContext, useEffect } from 'react';
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from '../contexts/CurrentUserContext';
import { useFormWithValidation } from '../hooks/useForm';

function EditProfilePopup({ isOpen, onClose, onUpdateUser, isDataLoad }) {
  const { values, errors, isValid, handleChange, setValues, resetForm } = useFormWithValidation();
  const currentUser = useContext(CurrentUserContext);

  function handleSubmit(e) {
    e.preventDefault();
    //* Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser(values);
  }

  useEffect(() => {
    if (currentUser) {
      resetForm();
      setValues({
        name: currentUser.name,
        about: currentUser.about
      });
    }
  }, [isOpen, resetForm, currentUser, setValues]);

  return (
    <PopupWithForm
      name="profile"
      id="editProfile"
      title="Редактировать профиль"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText={isDataLoad ? 'Сохраняем...' : 'Сохранить профиль'}
      isDisabled={!isValid}
    >
      <label className="popup__form-field">
        <input
          value={values.name || ''} onChange={handleChange}
          name="name"
          placeholder="Имя"
          required
          maxLength="40"
          className="popup__input"
          id="popup__name-input"
          type="text"
        />
        <span
          id="popup__name-input-error"
          className={`${errors.name ? 'popup__input-error popup__input-error_visible' : 'popup__input-error'}`}
        >{errors.name}</span>
      </label>
      <label className="popup__form-field">
        <input
          value={values.about || ''} onChange={handleChange}
          name="about"
          placeholder="Профессия"
          required
          maxLength="200"
          className="popup__input"
          id="popup__job-input"
          type="text"
        />
        <span
          id="popup__job-input-error"
          className={`${errors.about ? 'popup__input-error popup__input-error_visible' : 'popup__input-error'}`}
        >{errors.about}</span>
      </label>
    </PopupWithForm>
  )
}

export default EditProfilePopup;