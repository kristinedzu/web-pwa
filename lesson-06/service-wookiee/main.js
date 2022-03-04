// Register service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js");

  // Listen for messages from the service worker
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data.type === "fetch") {
      handleUpdateRequestCount();
    }
  });
}

const requestCountElement = document.querySelector("#request-count");

function handleUpdateRequestCount() {
  requestCountElement.textContent = Number(requestCountElement.textContent) + 1;
}

const template = document.querySelector("#template").content;
const boxes = document.querySelector("#boxes");

for (const fileType of ["text/css", "text/html", "application/json"]) {
  // Clone the template for each box
  const box = template.cloneNode(true);

  // Request fake.css, fake.html and fake.json, respectively
  const fileName = "fake." + fileType.split("/")[1];

  box.querySelector("button").textContent = "Fetch " + fileName;

  // Send fetch request on button click
  box.querySelector("button").addEventListener("click", async (event) => {
    try {
      const response = await fetch(fileName, {
        headers: {
          Accept: fileType,
        },
      });

      // Show response headers
      const headersList = event.target.parentNode.querySelector("dl");
      headersList.innerHTML = "";
      for (const [key, value] of response.headers.entries()) {
        headersList.insertAdjacentHTML(
          "beforeend",
          `<dt class="capitalize font-bold">${key}:</dt><dd>${value}</dd>`
        );
      }

      // Show response content
      const content = await response.text();
      event.target.parentNode.querySelector("textarea").value = content.trim();

      // Throw an error if the response is not "ok" (i.e. not 200-299 range)
      if (!response.ok) {
        throw new Error(response.status + " " + response.statusText);
      }
    } catch (error) {
      // Change button to display error status
      event.target.classList.remove("bg-yellow-800");
      event.target.classList.add("bg-red-700");
      event.target.textContent = error.message;
    }
  });
  boxes.appendChild(box);
}
