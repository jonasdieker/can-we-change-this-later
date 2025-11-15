// Basic POST helpers.

async function handleJsonOrText(res, url) {
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request to ${url} failed: ${res.status} ${res.statusText} - ${text}`);
  }
  const contentType = res.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

/**
 * POST JSON and parse JSON or text response.
 */
export async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body ?? {}),
  });
  return handleJsonOrText(res, url);
}

export async function hitEndpoint(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body ?? {}),
  });
  return handleJsonOrText(res, url);
}
