export class Card {
  constructor(data, templateSelector, handleImageClick) {
    this._name = data.name;
    this._link = data.link;
    this._templateSelector = templateSelector;
    this._handleImageClick = handleImageClick;
  }

  _getTemplate() {
    return document
      .querySelector(this._templateSelector)
      .content.querySelector(".card")
      .cloneNode(true);
  }

  _setEventListeners() {
    this._likeButton.addEventListener("click", () => this._handleLikeClick());
    this._cardImage.addEventListener("click", () =>
      this._handleImageClick(this._name, this._link)
    );
  }

  generateCard() {
    this._element = this._getTemplate();
    this._cardImage = this._element.querySelector(".card__image");
    this._cardTitle = this._element.querySelector(".card__title");
    this._likeButton = this._element.querySelector(".card__like-button");

    this._cardImage.src = this._link;
    this._cardImage.alt = this._name;
    this._cardTitle.textContent = this._name;

    this._setEventListeners();

    return this._element;
  }

  _handleLikeClick() {
    this._likeButton.classList.toggle("card__like-button_active");
  }
}

export function getCardElement(data, userId, handleLike, handleDeleteClick) {
  const cardTemplate = document.querySelector("#card-template");
  console.log("Card template:", cardTemplate); // Add this
  console.log("Card Data:", data);
  console.log("Card Data:", data); // Add this line at the very start
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  cardElement.dataset.cardId = data._id;
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likesCountElement = cardElement.querySelector(".card__like-count");

  cardImageEl.onerror = function () {
    console.log("Original image failed to load for:", data.name);
    console.log("Attempting to load fallback image");
    this.src =
      "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg";
    // Add another error handler for the fallback
    this.onerror = function () {
      console.log("Fallback image also failed to load");
    };
  };

  cardImageEl.onload = function () {
    console.log("Image successfully loaded for:", data.name);
  };

  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  const likesCount = data.likes ? data.likes.length : 0;
  likesCountElement.textContent = likesCount;

  if (data.likes && Array.isArray(data.likes)) {
    if (data.likes.some((user) => user._id === userId)) {
      likeButton.classList.add("card__like-button_liked");
    }
  }

  likeButton.addEventListener("click", (evt) => handleLike(evt, data));
  deleteButton.addEventListener("click", () => handleDeleteClick(cardElement));

  return cardElement;
}
