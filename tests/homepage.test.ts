import { describe, expect, test } from "bun:test";
import { bootstrap } from "+infra/bootstrap";
import { createServer } from "../server";
import * as mocks from "./mocks";

const url = "/";

describe(`GET ${url}`, async () => {
  const di = await bootstrap(mocks.Env);
  const server = createServer(di);

  test("happy path", async () => {
    const response = await server.request(url, { method: "GET" }, mocks.ip);
    const text = await response.text();

    expect(response.status).toEqual(200);
    expect(text).toEqual("Homepage");
  });
});
