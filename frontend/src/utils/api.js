//* Класс для взаимодействия с сервером
class Api {
  constructor(data) {
    this._baseUrl = data.serverUrl;
  }

  //* Проверка статуса запроса
  _requestResult(res) {
    if (res.ok) {
      return res.json();
    } else {
      return Promise.reject(
        `Что-то пошло не так: Ошибка ${res.status} - ${res.statusText}`
      );
    }
  }

  //* Запрос данных пользователя
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    }).then((res) => this._requestResult(res));
  }

  //* Запрос изначальных карточек
  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    }).then((res) => this._requestResult(res));
  }

  editAvatar(data) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then((res) => this._requestResult(res));
  }

  //* Запрос на редактирование данных пользователя
  editProfile(data) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about,
      }),
    }).then((res) => this._requestResult(res));
  }

  //* Запрос на добавление карточки
  addNewCard(data) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then((res) => this._requestResult(res));
  }

  //* Запрос на удаление карточки
  deleteCard(data) {
    return fetch(`${this._baseUrl}/cards/${data}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    }).then((res) => this._requestResult(res));
  }

  //* Запрос на добавление или удаление лайка карточки
  changeCardLike(cardId, isLiked) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: !isLiked ? "PUT" : "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem('jwt')}`,
      },
    }).then((res) => this._requestResult(res));
  }
}

const api = new Api({
  serverUrl: "https://api.mesto-qtrixnet.nomore.nomoredomains.club",
});

export default api;