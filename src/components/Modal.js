export class Modal {
  constructor(modalElement) {
    this._modalElement = modalElement;
    this._closeButton = modalElement.querySelector(".modal__close-btn");
    this._handleEscClose = this._handleEscClose.bind(this);
    this.setEventListeners();
  }

  open() {
    this._modalElement.classList.add("modal_opened");
    document.addEventListener("keydown", this._handleEscClose);
  }

  close() {
    this._modalElement.classList.remove("modal_opened");
    document.removeEventListener("keydown", this._handleEscClose);
  }

  _handleEscClose(evt) {
    if (evt.key === "Escape") {
      this.close();
    }
  }

  setEventListeners() {
    this._closeButton.addEventListener("click", () => this.close());
    this._modalElement.addEventListener("mousedown", (evt) => {
      if (evt.target === this._modalElement) {
        this.close();
      }
    });
  }
}
