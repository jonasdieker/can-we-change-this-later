// Load and parse CSV using PapaParse.

/**
 * Load CSV from a given path.
 * Returns { rows, text }.
 */
export async function loadCsv(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load CSV at ${path}: ${res.status}`);
  }
  const text = await res.text();

  return new Promise((resolve, reject) => {
    if (typeof Papa === 'undefined') {
      reject(new Error('PapaParse (Papa) not available.'));
      return;
    }
    Papa.parse(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => resolve({ rows: results.data, text }),
      error: (err) => reject(err),
    });
  });
}
