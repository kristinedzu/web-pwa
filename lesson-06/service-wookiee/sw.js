self.addEventListener("fetch", async (event) => {
  // Find the client that the fetch request was sent from
  const client = await self.clients.get(event.clientId);

  // If the client exists, post a message to it
  if (client) {
    client.postMessage({
      type: "fetch",
      url: event.request.url,
      method: event.request.method,
    });
  }
});

self.addEventListener("fetch", async (event) => {
  // Generate a correctly formated date string for the "Date" header
  const dateString = new Date().toUTCString();

  // Determine the file name of the requested file...
  const fileName = event.request.url.split("/").pop();

  // ...and respond with a mock response if we're requesting a fake.* file
  if (fileName === "fake.css") {
    event.respondWith(
      new Response("/* CSS! */", {
        headers: {
          "Date": dateString,
          "Content-Type": "text/css",
        },
      })
    );
  } else if (fileName === "fake.html") {
    event.respondWith(
      new Response("<!-- HTML! -->", {
        headers: {
          "Date": dateString,
          "Content-Type": "text/html",
        },
      })
    );
  } else if (fileName === "fake.json") {
    event.respondWith(
      new Response('{ "type": "JSON!" }', {
        headers: {
          "Date": dateString,
          "Content-Type": "application/json",
        },
      })
    );
  }
});
