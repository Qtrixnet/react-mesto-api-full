import React, { useRef, useEffect } from 'react';
import PopupWithForm from "./PopupWithForm";
import { useFormWithValidation } from '../hooks/useForm';

function EditAvatarPopup({ isOpen, onClose, onUpdateAvatar, isDataLoad }) {
  const { values, errors, isValid, handleChange, resetForm } = useFormWithValidation();

  const avatarRef = useRef(); //* записываем объект, возвращаемый хуком, в переменную

  function handleSubmit(e) {
    e.preventDefault();

    onUpdateAvatar(values);
  }

  useEffect(() => {
    resetForm();
  }, [isOpen, resetForm]);

  return (
    <PopupWithForm
      name="updateAvatar"
      id="update"
      title="Обновить аватар"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      submitText={isDataLoad ? 'Обновляем...' : 'Обновить'}
      isDisabled={!isValid}
    >
      <label className="popup__form-field">
        <input
          value={values.avatar || ""} onChange={handleChange}
          ref={avatarRef}
          name="avatar"
          className="popup__input"
          id="popup__avatarLink-input"
          required
          placeholder="Ссылка на изображение"
          type="url"
        />
        <span
          id="popup__avatarLink-input-error"
          className={`${errors.avatar ? 'popup__input-error popup__input-error_visible' : 'popup__input-error'}`}
        >{errors.avatar}</span>
      </label>
    </PopupWithForm>
  )
}

export default EditAvatarPopup;