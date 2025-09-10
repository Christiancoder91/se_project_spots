import logoImage from "../images/Logo.svg";
import pencilIcon from "../images/pencil.svg";
import plusIcon from "../images/plus.svg";
import closeIcon from "../images/close.svg";

import {
  resetValidation,
  disableButton,
  settings,
  enableValidation,
} from "../components/FormValidator.js";
import "./index.css";
import { setButtonText } from "../utils/helpers.js";
import Api from "../utils/Api.js";

import { Card, getCardElement } from "../components/Card.js";
import { Modal } from "../components/Modal.js";
import { FormValidator } from "../components/FormValidator.js";
import * as constants from "../utils/constants.js";

let userId;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "603f7896-dee4-4430-b0b2-876467149f45",
    "Content-Type": "application/json",
  },
});

document.addEventListener("DOMContentLoaded", () => {
  setImages();
});

api
  .getAppInfo()
  .then(([cards, userData]) => {
    console.log("User Data:", userData);
    userId = userData._id;
    cards.forEach((cardData) => {
      const cardElement = getCardElement(
        cardData,
        userId,
        handleLike,
        handleDeleteClick,
        handleImageClick
      );
      cardsList.append(cardElement);
    });

    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatarImage.src = userData.avatar;
    console.log("Setting initial avatar src to:", userData.avatar);
    console.log("Current avatar element:", profileAvatarImage);
  })
  .catch((err) => {
    console.error("Error loading data:", err);
  });

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");
const profileAvatarImage = document.querySelector(".profile__avatar");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalBtn = document.querySelector(".profile__add-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarLinkInput = avatarModal.querySelector("#profile-avatar-input");

// Delete form elements
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const cardSubmitButton = cardModal.querySelector(".modal__submit-btn");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function handleImageClick(imageSrc, imageAlt) {
  console.log("Image clicked - src:", imageSrc, "alt:", imageAlt);
  previewModalImageEl.src = imageSrc;
  previewModalImageEl.alt = imageAlt;
  previewModalCaptionEl.textContent = imageAlt;
  previewModalInstance.open();
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";
  api
    .editUserInfo({
      name: editModalNameInput.value,
      about: editModalDescriptionInput.value,
    })
    .then((data) => {
      profileName.textContent = editModalNameInput.value;
      profileDescription.textContent = editModalDescriptionInput.value;
      editModalInstance.close();
    })
    .catch(console.error)
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  api
    .addCard(cardNameInput.value, cardLinkInput.value)
    .then((cardData) => {
      const cardElement = getCardElement(
        cardData,
        userId,
        handleLike,
        handleDeleteClick,
        handleImageClick
      );
      cardsList.prepend(cardElement);
      cardForm.reset();
      cardModalInstance.close();
    })
    .catch((err) => console.error(err))
    .finally(() => {
      submitBtn.textContent = "Create";
    });
}

function handleAvatarSubmit(evt) {
  evt.preventDefault();
  const submitBtn = evt.submitter;
  submitBtn.textContent = "Saving...";

  api
    .editAvatarInfo(avatarLinkInput.value)
    .then((data) => {
      profileAvatarImage.src = data.avatar;
      avatarForm.reset();
      avatarModalInstance.close();
      console.log("Avatar updated successfully:", data.avatar);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitBtn.textContent = "Save";
    });
}

let cardToDelete = null;

function handleDeleteSubmit(cardElement) {
  const cardId = cardElement.dataset.cardId;
  const submitButton = deleteModal.querySelector(".modal__submit-btn");
  submitButton.textContent = "Deleting...";
  cardToDelete = null;

  api
    .deleteCard(cardId)
    .then(() => {
      cardElement.remove();
      deleteModalInstance.close();
    })
    .catch((err) => console.error(err))
    .finally(() => {
      submitButton.textContent = "Yes";
    });
}
function handleDeleteClick(cardElement) {
  cardToDelete = cardElement;
  deleteModalInstance.open();
}

function handleLike(evt, cardData) {
  console.log("Like button clicked!");
  const likeButton = evt.target;
  const likesCountElement = evt.target
    .closest(".card__like-container")
    .querySelector(".card__like-count");
  const isLiked = likeButton.classList.contains("card__like-button_liked");

  api
    .handleLike(cardData._id, isLiked)
    .then((updatedCard) => {
      likeButton.classList.toggle("card__like-button_liked");
      let newLikesCount = updatedCard.likes.length;
      likesCountElement.textContent = newLikesCount;
    })
    .catch((err) => {
      console.log("API error:", err);
      console.error(err);
    });
}

function setImages() {
  // Header and profile images
  document.querySelector(".header__logo").src = logoImage;
  document.querySelector(".profile__edit-btn img").src = pencilIcon;
  document.querySelector(".profile__add-btn img").src = plusIcon;
  document.querySelector(".profile__pencil-icon").src = pencilIcon;

  // Close buttons
  const closeButtons = document.querySelectorAll(".modal__close-btn img");
  closeButtons.forEach((button) => {
    button.src = closeIcon;
  });
}

const editModalInstance = new Modal(editModal);
const cardModalInstance = new Modal(cardModal);
const avatarModalInstance = new Modal(avatarModal);
const previewModalInstance = new Modal(previewModal);
const deleteModalInstance = new Modal(deleteModal);

const cancelButton = deleteForm.querySelector(".modal__button_type_cancel");

cancelButton.addEventListener("click", () => {
  deleteModalInstance.close();
});

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(editFormElement, settings);
  editModalInstance.open();
});
editModalCloseBtn.addEventListener("click", () => editModalInstance.close());

cardModalBtn.addEventListener("click", () => cardModalInstance.open());
cardModalCloseBtn.addEventListener("click", () => cardModalInstance.close());

avatarModalBtn.addEventListener("click", () => avatarModalInstance.open());
avatarModalCloseBtn.addEventListener("click", () =>
  avatarModalInstance.close()
);

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);

previewModalCloseBtn.addEventListener("click", () =>
  previewModalInstance.close()
);

deleteForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  if (cardToDelete) {
    handleDeleteSubmit(cardToDelete);
  }
});
deleteModalCloseBtn.addEventListener("click", () =>
  deleteModalInstance.close()
);

enableValidation(settings);
