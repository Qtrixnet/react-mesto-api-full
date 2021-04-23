import React, { useEffect, useState } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import CurrentUserContext from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmDeletePopup from "./ConfirmDeletePopup";
import Login from "./Login";
import Register from './Register';
import InfoTooltip from './InfoTooltip';
import { Route, Switch, Redirect, useHistory } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import * as auth from '../utils/auth';

function App() {

  const history = useHistory();

  //! Состояния
  //* Попапы
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isCardDelete, setIsCardDelete] = useState(false);
  const [isInfoTooltipShow, setInfoTooltipShow] = useState({ isOpen: false, successful: false });
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [profileEmail, setProfileEmail] = useState('')

  //* Данные
  const [isDataLoad, setIsDataLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({});
  const [selectedCard, setSelectedCard] = useState({
    isOpen: false,
    element: {},
  });
  const [selectedCardDelete, setSelectedCardDelete] = useState({
    element: {}
  });

  //! Эффекты при монтировании компонентов

  //* Проверка токена и авторизация пользователя
  useEffect(() => {
    const jwt = localStorage.getItem('jwt')
    if (jwt) {
      api.getUserInfo()
        .then(data => {
          if (data) {
            setProfileEmail(data.email)
            setLoggedIn(true)
            history.push('/');
          }
        })
        .catch(err => { console.log(err); })
    }
  }, [history]);

  //* Получение информации о пользователе
  useEffect(() => {
    if (loggedIn) {
      setIsLoading(true)
      api.getUserInfo()
        .then(res => { setCurrentUser(res); })
        .catch(err => { console.log(err); })
        .finally(() => { setIsLoading(false) })
    }
  }, [loggedIn]);

  //* Загрузка карточек
  useEffect(() => {
    if (loggedIn) {
      setIsLoading(true)
      api.getInitialCards()
        .then(initialCards => {
          setCards(initialCards.reverse());
        })
        .catch(err => console.log(err))
        .finally(() => { setIsLoading(false) })
    }
  }, [loggedIn]);

  //! Функции обработчики
  function handleEditAvatarClick() {
    setEditAvatarPopupOpen(!isEditAvatarPopupOpen);
  }

  function handleDeleteButtonClick(card) {
    setIsCardDelete(!isCardDelete);
    setSelectedCardDelete(card);
  }

  function handleEditProfileClick() {
    setEditProfilePopupOpen(!isEditProfilePopupOpen);
  }

  function handleAddPlaceClick() {
    setAddPlacePopupOpen(!isAddPlacePopupOpen);
  }

  function handleCardClick(card) {
    setSelectedCard({ ...selectedCard, isOpen: true, element: card });
  }

  function handleInfoTooltip(res) {
    setInfoTooltipShow({ ...isInfoTooltipShow, isOpen: true, successful: res });
  }

  function closeAllPopups() {
    setEditAvatarPopupOpen(false);
    setEditProfilePopupOpen(false);
    setAddPlacePopupOpen(false);
    setIsCardDelete(false);
    setSelectedCard({ ...selectedCard, isOpen: false });
    setSelectedCardDelete({});
    setIsDataLoad(false);
    setInfoTooltipShow({ isOpen: false, successful: false })
  }

  function handleCardLike(card) {
    //* Снова проверяем, есть ли уже лайк на данной карточке
    const isLiked = card.likes.some(i => i === currentUser._id);

    //* Отправляем запрос в API и получаем обновлённые данные карточки

    api.changeCardLike(card._id, isLiked)
      .then((newCard) => {
        //* Обновляем стейт
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => {
        console.log(err);
      });
  }

  function handleUpdateUser(newUserData) {
    setIsDataLoad(true);
    api.editProfile(newUserData)
      .then(res => { setCurrentUser(res); closeAllPopups() })
      .catch(err => { console.log(err) })
      .finally(() => { setIsDataLoad(false) });
  }

  function handleUpdateAvatar(newAvatar) {
    setIsDataLoad(true);
    api.editAvatar(newAvatar)
      .then(res => { setCurrentUser(res); closeAllPopups() })
      .catch(err => { console.log(err) })
      .finally(() => { setIsDataLoad(false) });
  }

  function handleAddPlaceSubmit(newCard) {
    setIsDataLoad(true);
    api.addNewCard(newCard).then((res) => {
      setCards([res, ...cards]); closeAllPopups()
    })
      .catch(err => {
        console.log(err);
      })
      .finally(() => { setIsDataLoad(false) });
  }

  function handleCardDelete(card) {
    setIsDataLoad(true);
    api.deleteCard(card._id).then(() => {
      const newCards = cards.filter(newCard => newCard._id !== card._id)
      //* Обновляем стейт
      setCards(newCards);
      closeAllPopups()
    })
      .catch(err => {
        console.log(err);
      })
      .finally(() => { setIsDataLoad(false) });
  }

  //* Вход в систему
  function handleLogin({ email, password }) {
    auth.login(email, password)
      .then(res => {
        if (res.token) {
          setProfileEmail(email)
          localStorage.setItem('jwt', res.token);
          setLoggedIn(true);
          history.push('/');
        }
      })
      .catch(err => {
        handleInfoTooltip(false);
        console.log(err)
      })
  }

  //* Регистрация пользователя
  function handleRegister({ email, password }) {
    auth.register(email, password)
      .then(data => {
        if (data) {
          handleInfoTooltip(true);
          history.push('/sign-in');
        }
      })
      .catch(err => {
        handleInfoTooltip(false);
        console.log(err);
      })
  }

  //* Выход из системы
  const handleSignOut = () => {
    localStorage.removeItem('jwt');
    setProfileEmail('')
    setLoggedIn(false);
    history.push('/sign-in');
  }

  return (
    <div className="App">
      <div className="page">
        <div className="page__container">
          <CurrentUserContext.Provider value={currentUser}>
            <Header loggedIn={loggedIn} email={profileEmail} onSignOut={handleSignOut} />
            <Switch>
              <ProtectedRoute
                exact path="/"
                loggedIn={loggedIn}
                component={Main}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onCardDelete={handleDeleteButtonClick}
                onCardLike={handleCardLike}
                cards={cards}
                loading={isLoading}
              />
              <Route path="/sign-up">
                <Register onRegister={handleRegister} />
              </Route>
              <Route path="/sign-in">
                <Login onLogin={handleLogin} />
              </Route>
              <Route>
                {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
              </Route>
            </Switch>
            <Footer />
            <InfoTooltip onClose={closeAllPopups} status={isInfoTooltipShow} />
            <EditProfilePopup isDataLoad={isDataLoad} onUpdateUser={handleUpdateUser} isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} />
            <AddPlacePopup isDataLoad={isDataLoad} onAddCard={handleAddPlaceSubmit} isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} />
            <EditAvatarPopup isDataLoad={isDataLoad} onUpdateAvatar={handleUpdateAvatar} isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} />
            <ConfirmDeletePopup card={selectedCardDelete} isDataLoad={isDataLoad} onDeleteCard={handleCardDelete} isOpen={isCardDelete} onClose={closeAllPopups} />
            <ImagePopup card={selectedCard} onClose={closeAllPopups} />
          </CurrentUserContext.Provider>
        </div>
      </div>
    </div>
  );
}

export default App;
