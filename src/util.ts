export async function postJson(url: string, body: string) {
  const opts = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  };
  return fetch(url, opts);
}

export function test() {
  console.log("test");
}
