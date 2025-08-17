export async function GET() {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT+'learn');

    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({ message: data.message || "Learn request failed" }), {
        status: response.status,
      });
    }

    return new Response(JSON.stringify({ message: data.message, status: 200}));

  } catch (error) {
    console.error("Error calling FastAPI /learn:", error);
    return new Response(JSON.stringify({ error: "Learn process failed", status: 500}));
  }
}
