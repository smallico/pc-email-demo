export let http = {
  get: function(url, config = {}) {
    return loadData(url);
  },
  post: function(url, data, config = {}) {
    return loadData(url);
  }
};
async function loadData(file) {
  return { data: (await import("../data" + file + ".json")).default };
}

export function request(url, cb) {
  http
    .get(url)
    .then(res => res.data)
    .then(cb);
}
