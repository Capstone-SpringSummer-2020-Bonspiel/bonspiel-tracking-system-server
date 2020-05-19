const axios = require("axios").default;
const chai = require("chai");
const assert = chai.assert;

describe("Smoke test", () => {
  it("smoke test", async () => {
    const response = await axios.get("http://localhost:8080");
    assert.equal(response.status, 200);
    assert.isString(response.data);
  })
});