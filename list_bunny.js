const BOTTLE_CDN = "https://vinaio-bottles-cdn.b-cdn.net";
async function fetchRecursive(path = "") {
  const url = `https://storage.bunnycdn.com/bottleimages1/${path}`;
  const res = await fetch(url, { headers: { "AccessKey": "e3cca9fc-08ac-4876-9e09c6c5f1c6-f32c-437e" } });
  if (!res.ok) return [];
  const items = await res.json();
  let files = [];
  for (const item of items) {
    if (item.IsDirectory) files = files.concat(await fetchRecursive(`${path}${item.ObjectName}/`));
    else files.push(`${path}${item.ObjectName}`);
  }
  return files;
}
fetchRecursive().then(files => {
  const rums = files.filter(f => /bermudez|macorix|legado|puntacana|jamaican|khukri/i.test(f));
  console.log(rums.map(r => BOTTLE_CDN + "/" + r.split("/").map(encodeURIComponent).join("/")));
});
