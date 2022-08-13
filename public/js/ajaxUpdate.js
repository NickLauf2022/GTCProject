console.log("Hello bro");
import { processAJAX } from "./ajaxHandling.js";

const FIELDS = document.querySelectorAll("input");
const UPDATE_BTN = document.querySelector(".utility-btn");
const ID = new URLSearchParams(location.search).get("id");
const URL = "http://localhost:8900/ajax/";

window.addEventListener("load", () => {
  disableFields();
  UPDATE_BTN.setAttribute("disabled", "");
  processAJAX(URL, "GET", ID, null, processResult);
});

function disableFields() {
  FIELDS.forEach((field) => {
    field.setAttribute("disabled", "");
  });
}

function processResult(response, type) {
  switch (type) {
    case "GET":
      let bookValues = Object.values(response);
      autoFillForm(bookValues);
      enableFields();
      UPDATE_BTN.removeAttribute("disabled");
      UPDATE_BTN.addEventListener("click", updateBookHandling);
      break;
    case "PUT":
      window.location.href = "ajax";
      break;
  }
}

function autoFillForm(bookValues) {
  for (let i = 1; i < bookValues.length; i++) {
    FIELDS[i - 1].value = bookValues[i];
  }
}

function enableFields() {
  FIELDS.forEach((field) => {
    field.removeAttribute("disabled");
  });
}

function updateBookHandling(evt) {
  evt.preventDefault();
  let fieldValues = getFieldValues();
  let updatedBook = buildBookObject(fieldValues);
  processAJAX(URL, "PUT", ID, updatedBook, processResult);
}

function getFieldValues() {
  let fieldValues = [];
  FIELDS.forEach((field) => {
    fieldValues.push(field.value);
  });
  return fieldValues;
}

function buildBookObject(fieldValues) {
  return {
    id: ID,
    title: fieldValues[0],
    author: fieldValues[1],
    publisher: fieldValues[2],
    year: fieldValues[3],
  };
}
