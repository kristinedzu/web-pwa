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
