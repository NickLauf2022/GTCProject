import { processAJAX } from "./ajaxHandling.js";
let books = [];

const ADD_BTN = document.querySelector(".form-body button");
let url = "http://localhost:8900/ajax";

ADD_BTN.addEventListener("click", (e) => {
  e.preventDefault();

  processAJAX(url + "/books", "GET", "", null, processResult);
});

function processResult(response, type) {
  switch (type) {
    case "GET":
      books = response;
      let greatestId = getGreatestID();

      if (greatestId == -1) greatestId = 0;

      let book = buildBookObject(greatestId + 1);

      processAJAX(url + "/books", "POST", "", book, processResult);
      break;

    case "POST":
      window.location.href = "ajax";
      break;
  }
}

function getGreatestID() {
  let greatestId = -1;
  for (let i = 0; i < books.length; i++) {
    if (books[i].id > greatestId) greatestId = books[i].id;
  }
  return greatestId;
}

function buildBookObject(ID) {
  let inputs = document.querySelectorAll("input");

  return {
    id: ID,
    title: inputs[0].value,
    author: inputs[1].value,
    publisher: inputs[2].value,
    year: inputs[3].value,
  };
}
