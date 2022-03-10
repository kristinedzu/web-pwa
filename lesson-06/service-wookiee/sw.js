const CACHE_NAME = "v1";

// Cache page resources when SW is installed
self.addEventListener("install", async (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "./index.html",
        "./chewie.jpg",
        "./main.js",
        "./style.css",
      ]);
    })
  );
});

// Send a message to the page for each fetch request
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

// Mock responses to the fake.* file requests
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

// Cache-first strategy for other resources
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
