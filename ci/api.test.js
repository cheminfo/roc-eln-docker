const axios = require("axios");

test("couchdb is up", async () => {
  const response = await axios.get("http://localhost:4445/");
  expect(response.status).toEqual(200);
  expect(response.data.couchdb).toEqual("Welcome");
});

test("root is up", async () => {
  const response = await axios.get("http://localhost:4444/");
  expect(response.status).toEqual(200);
  expect(response.data).toContain("<title>\n        ELN\n    </title>");
});

test("rest-on-couch interface is up", async () => {
  const response = await axios.get("http://localhost:4444/roc/#/");
  expect(response.status).toEqual(200);
  expect(response.data).toContain(" <title>rest-on-couch</title>");
});
