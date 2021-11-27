import Button from "./button.js";
import Toolbar from "./toolbar.js";
export default class Editor {
  constructor(parentNode, editTarget, buttons, openWithLinkInput, cb) {
    this.cb = cb;
    this.buttons = buttons;
    this.parentNode = parentNode;
    this.editTarget = editTarget;
    this.text = editTarget.name;
    this.link = editTarget.url ?? "#";
    this.linkEditorIsOpen = openWithLinkInput;

    // replace element with editor
    parentNode.removeChild(parentNode.querySelector("#" + editTarget.id));
    parentNode.appendChild(this.html());
  }

  html() {
    const li = document.createElement("li");
    li.classList.add("editor");

    const firstRow = document.createElement("div");
    firstRow.classList.add("firstRow");

    // create input field
    const input = document.createElement("input");
    input.addEventListener("focusout", (event) => {
      console.log(document.activeElement);
      setTimeout(() => {
        if (!li.contains(document.activeElement)) {
          this.save();
        }
      });
    });
    input.type = "text";
    input.value = this.text;
    input.addEventListener("keydown", (e) => {
      this.text = input.value;
      if (e.keyCode === 13) {
        this.save();
      }
    });
    firstRow.appendChild(input);

    // create toolbar
    const toolBar = new Toolbar(this.buttons, (buttonName) => {
      if (buttonName === "cancel") {
        this.close();
      } else if (buttonName === "delete") {
        this.delete();
      } else if (buttonName === "link") {
        this.#toggleLinkInput(li);
      }
    }).html();
    firstRow.appendChild(toolBar);

    li.appendChild(firstRow);
    if (this.linkEditorIsOpen) this.#openLinkInput(li);

    if (this.linkEditorIsOpen) return li;
  }

  save() {
    this.#remove();
    this.cb({ type: "save", editResult: { text: this.text, link: this.link } });
  }

  close() {
    this.#remove();
    this.cb({
      type: "close",
      editResult: { text: this.text, link: this.link },
    });
  }

  delete() {
    this.#remove();
    this.cb({
      type: "delete",
      editResult: { text: this.text, link: this.link },
    });
  }

  #toggleLinkInput(li) {
    if (this.linkEditorIsOpen) this.#closeLinkInput(li);
    else this.#openLinkInput(li);
  }
  #openLinkInput(li) {
    this.linkEditorIsOpen = true;
    const secondRow = document.createElement("div");
    secondRow.classList.add("secondRow");

    const input = document.createElement("input");
    input.addEventListener("focusout", (event) => {
      setTimeout(() => {
        if (!li.contains(document.activeElement)) {
          this.save();
        }
      });
    });
    input.type = "text";
    input.value = this.link;
    input.addEventListener("keydown", (e) => {
      this.link = input.value;
      if (e.keyCode === 13) {
        this.save();
      }
    });
    secondRow.appendChild(input);
    li.appendChild(secondRow);
  }

  #closeLinkInput(li) {
    this.linkEditorIsOpen = false;
    li.querySelector(".secondRow").remove();
  }

  #remove() {
    const el = this.parentNode.querySelector(".editor");
    this.parentNode.removeChild(el);
  }
}