export default {
  async fetch(request) {

    if (request.method === "GET") {
      return new Response("GET OK");
    }

    if (request.method === "POST") {
      return new Response("POST OK");
    }

    return new Response("OTHER");
  }
}
