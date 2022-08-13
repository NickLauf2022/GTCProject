let squareCount = 16;
let emptySquare;

$(document).ready(function () {
  jQuery.event.props.push("dataTransfer");
  createBoard();
  addTiles();
  $("#gameBoard").on("dragstart", dragStarted);
  $("#gameBoard").on("dragend", dragEnded);
  $("#gameBoard").on("dragenter", preventDefault);
  $("#gameBoard").on("dragover", preventDefault);
  $("#gameBoard").on("drop", drop);
  scramble();
});

function createBoard() {
  for (let i = 0; i < squareCount; i++) {
    let $square = $(
      '<div id="square' + i + '" data-square="' + i + '" class="square"></div>'
    );
    $square.appendTo($("#gameBoard"));
  }
}

function addTiles() {
  emptySquare = squareCount - 1;
  for (let i = 0; i < emptySquare; i++) {
    let $square = $("#square" + i);
    let $tile = $(
      '<div draggable="true" id="tile' +
        i +
        '" class="tile">' +
        (i + 1) +
        "</div>"
    );
    $tile.appendTo($square);
  }
}

function dragStarted(e) {
  let $tile = $(e.target);
  $tile.addClass("dragged");
  let sourceLocation = $tile.parent().data("square");
  e.dataTransfer.setData("text", sourceLocation.toString());
  e.dataTransfer.effectAllowed = "move";
}

function dragEnded(e) {
  $(e.target).removeClass("dragged");
}

function preventDefault(e) {
  e.preventDefault();
}

function drop(e) {
  let $square = $(e.target);
  if ($square.hasClass("square")) {
    let destinationLocation = $square.data("square");
    if (emptySquare != destinationLocation) return;
    let sourceLocation = Number(e.dataTransfer.getData("text"));
    moveTile(sourceLocation);
    checkForWinner();
  }
}

function moveTile(sourceLocation) {
  let distance = sourceLocation - emptySquare;
  if (distance < 0) distance = -distance;
  if (distance == 1 || distance == 4) {
    swapTileAndEmptySquare(sourceLocation);
  }
}

function swapTileAndEmptySquare(sourceLocation) {
  let $draggedItem = $("#square" + sourceLocation).children();
  $draggedItem.detach();
  let $target = $("#square" + emptySquare);
  $draggedItem.appendTo($target);
  emptySquare = sourceLocation;
}

function scramble() {
  for (let i = 0; i < 128; i++) {
    let random = Math.random();
    let sourceLocation;
    if (random < 0.5) {
      let column = emptySquare % 4;
      if (column == 0 || (random < 0.25 && column != 3)) {
        sourceLocation = emptySquare + 1;
      } else {
        sourceLocation = emptySquare - 1;
      }
    } else {
      let row = Math.floor(emptySquare / 4);
      if (row == 0 || (random < 0.75 && row != 3)) {
        sourceLocation = emptySquare + 4;
      } else {
        sourceLocation = emptySquare - 4;
      }
    }
    swapTileAndEmptySquare(sourceLocation);
  }
}

function checkForWinner() {
  if (emptySquare != squareCount - 1) return;
  for (let i = 0; i < emptySquare; i++) {
    if (
      $("#tile" + i)
        .parent()
        .attr("id") !=
      "square" + i
    )
      return;
  }
  $("#message").html("Winner!");
}
