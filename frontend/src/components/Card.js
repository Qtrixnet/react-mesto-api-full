import React, { useContext } from "react";
import CurrentUserContext from '../contexts/CurrentUserContext';

function Card({ card, likeCounter, onCardClick, onCardDelete, onCardLike }) {

  const currentUser = useContext(CurrentUserContext);

  //* Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = card.owner === currentUser._id;

  //* Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = (
    `elements__delete-button ${isOwn ? 'elements__delete-button_visible' : 'elements__delete-button_hidden'}`
  );

  //* Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.some(i => i === currentUser._id);

  //* Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = (
    `elements__like-button ${isLiked ? 'elements__like-button_active heartbeat' : ''}`
  );

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card)
  }

  function handleDeleteClick() {
    onCardDelete(card)
  }

  return (
    <li className="elements__list-item">
      <img
        src={card.link}
        className="elements__picture"
        title="Посмотреть фотографию"
        alt={card.name}
        onClick={handleClick}
        loading="lazy"
      />
      <div className="elements__container">
        <h2 className="elements__text">{card.name}</h2>
        <button
          type="button"
          title="Удалить карточку"
          className={cardDeleteButtonClassName}
          onClick={handleDeleteClick}
        ></button>
        <div className="elements__like-container">
          <button
            type="button"
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
          ></button>
          <span className="elements__like-counter">{likeCounter}</span>
        </div>
      </div>
    </li>
  );
}

export default Card;