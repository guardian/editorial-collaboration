async function postSteps(documentId = "", data = {}) {
  const response = await fetch(`/documents/${documentId}/steps`, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow", 
    referrerPolicy: "no-referrer", 
    body: JSON.stringify(data),
  });
  console.log('response received:',response.statusText, response.status)
  return response; 
}
