addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
  });
  
  const GAS_URL = "https://script.google.com/macros/s/AKfycbxDTpPqWR520vV95XqSflaoGqWOF0Dv2ReDx-cD8WqedHTVwJg0dWMxkxftav30XkDU/exec";
  
  async function handleRequest(request) {
    if (request.method === "OPTIONS") {
      // Handle CORS preflight request.
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    } else if (request.method === "POST") {
      // Read the body into a buffer
      const body = await request.text();
      
      // Forward the request to the Google Apps Script
      const response = await fetch(GAS_URL, {
        method: "POST",
        body: body,
        headers: { "Content-Type": "application/json" },
      });
  
      const results = await response.json();
  
      // Respond to the original caller with the results from the Google Apps Script
      return new Response(JSON.stringify(results), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } else {
      return new Response("Method not allowed", { status: 405 });
    }
  }