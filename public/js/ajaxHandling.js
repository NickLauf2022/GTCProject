function processAJAX(url, type = "GET", id = "", data = null, processResult) {
  data = convertData(data, type);

  let xhr = new XMLHttpRequest();
  xhr.open(type, url + id, true);
  xhr.setRequestHeader("Content-type", "application/json", "char-set:utf-8");
  xhr.send(data);

  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // Convert data to JS object
      let response = JSON.parse(xhr.responseText);
      processResult(response, type);
    }
  };
  xhr.error = () => {
    alert("Cannot connect to the server");
  };
}

function convertData(data, type) {
  if (type == "GET" || type == "DELETE") {
    data = null;
  } else {
    data = JSON.stringify(data);
  }
  return data;
}

export { processAJAX };
