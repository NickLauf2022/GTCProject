import { processAJAX } from "./ajaxHandling.js";

const TBODY = document.getElementsByTagName("tbody")[0];
const ADD_NEW_BTN = document.getElementById("add-btn");
const DELETE_ALL_BTN = document.getElementById("delete-all-btn");

let url = "http://localhost:8900";

window.addEventListener("load", () => {
  generateBooks();
  ADD_NEW_BTN.addEventListener("click", () => goToNewPage("ajax-add"));
  DELETE_ALL_BTN.addEventListener("click", deleteAllFieldsHandling);
});

function generateBooks() {
  processAJAX(url + "/ajax/books", "GET", "", null, processResult);
}

function processResult(response, type) {
  switch (type) {
    case "GET":
      let html = generateBooksHTML(response);
      TBODY.innerHTML = html;
      addEventListenersOnBookFields();
      break;
    case "DELETE":
      generateBooks();
      break;
  }
}

function generateBooksHTML(books) {
  let html = "";

  for (let i = 0; i < books.length; i++) {
    html += `
         <tr>
            <td>${books[i].id}</td>
            <td>${books[i].title}</td>
            <td>${books[i].author}</td>
            <td>${books[i].publisher}</td>
            <td>${books[i].year}</td>
            <td class='action-btn-set'>
              <button class="utility-btn edit-btn">Edit</button>
              <button class="utility-btn delete-btn">Delete</button>
            </td>
          </tr>`;
  }
  return html;
}

function addEventListenersOnBookFields() {
  let actionButtonSets = document.querySelectorAll(".action-btn-set");

  for (let i = 0; i < actionButtonSets.length; i++) {
    let editButton = actionButtonSets[i].children[0];
    let deleteButton = actionButtonSets[i].children[1];

    editButton.addEventListener("click", () => {
      let id = getIdFromActionBtn(editButton);
      goToNewPage(`ajax-update?id=${id}`);
    });
    deleteButton.addEventListener("click", () => {
      let id = getIdFromActionBtn(deleteButton);

      deleteField(id);
    });
  }
}

function getIdFromActionBtn(btn) {
  let id = btn.parentElement.parentElement.children[0].innerText;
  return id;
}

function goToNewPage(url) {
  window.location.href = url;
}

function deleteField(id) {
  processAJAX(url + "/ajax/", "DELETE", id, null, processResult);
}

function deleteAllFieldsHandling() {
  processAJAX(url + "/ajax/", "DELETE", "", null, processResult);
}
