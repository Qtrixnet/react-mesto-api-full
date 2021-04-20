import React, { useContext } from "react";
import Card from "./Card";
import CurrentUserContext from '../contexts/CurrentUserContext';
import Spinner from './Spinner/Spinner';

function Main({ onEditAvatar, onEditProfile, onAddPlace, onCardClick, onCardDelete, onCardLike, cards, loading }) {

  const { name, about, avatar } = useContext(CurrentUserContext);

  return (
    <main className="content">
      <section className="profile">
        <div className="profile__avatar-edit">
          <img
            className="profile__avatar"
            title="Аватар профиля"
            src={avatar}
            alt="Аватар"
          />
          <button
            title="Загрузить новый аватар"
            className="profile__avatar-edit-button"
            onClick={onEditAvatar}
          ></button>
        </div>
        <div className="profile__info">
          <h1 id="profile__name" className="profile__name">
            {name}
          </h1>
          <p id="profile__job" className="profile__job">
            {about}
          </p>
          <button
            type="button"
            title="Редактировать профиль"
            className="profile__edit-button"
            onClick={onEditProfile}
          ></button>
        </div>
        <button
          type="button"
          title="Добавить новую фотографию"
          className="profile__add-button"
          onClick={onAddPlace}
        ></button>
      </section>
      <section className="elements">
        {
          loading ? <Spinner /> :
            <ul className="elements__list">
              {cards.map((card) => (
                <Card
                  key={card._id}
                  card={card}
                  onCardClick={onCardClick}
                  onCardDelete={onCardDelete}
                  likeCounter={card.likes.length}
                  onCardLike={onCardLike}
                />
              ))}
            </ul>
        }
      </section>
    </main>
  );
}

export default Main;
