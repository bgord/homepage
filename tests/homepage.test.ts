import { describe, expect, test } from "bun:test";
import { server } from "../server";
import * as mocks from "./mocks";

const url = "/";

describe(`GET ${url}`, () => {
  test("happy path", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const text = await response.text();

    expect(response.status).toEqual(200);
    expect(text).toEqual("Homepage");
  });
});
