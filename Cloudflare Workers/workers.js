addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
  });
  
  const GAS_URL = "https://script.google.com/macros/s/AKfycbwc6ogM0tIJfEkvWh_m8ROUmOorQdaxHUwO_TBdcOjyU64rKCenhhGUfBWxuCvbiPCG/exec";
  
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
        try {
            const body = await request.text();
            const response = await fetch(GAS_URL, {
                method: "POST",
                body: body,
                headers: { "Content-Type": "application/json" },
            });
  
            if (!response.ok) {
                throw new Error(`Failed to fetch from Google Apps Script. Status: ${response.status}`);
            }
  
            const results = await response.json();
            return new Response(JSON.stringify(results), {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            });
        } catch (err) {
            console.error(err);  // Log the error for debugging
            return new Response(JSON.stringify({
                status: "error",
                message: err.message || "An unexpected error occurred",
                top5: []
            }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                }
            });
        }
    } else {
        return new Response("Method not allowed", { status: 405 });
    }
  }