import { env } from "cloudflare:workers";
import { createExecutionContext, waitOnExecutionContext } from "cloudflare:test";
import worker from "../src/index";

const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

export async function call(
  path: string,
  init: RequestInit = {},
  ip: string | null = "203.0.113.10",
  origin = "https://creova.test",
): Promise<Response> {
  const headers = new Headers(init.headers);
  if (ip && !headers.has("cf-connecting-ip")) headers.set("cf-connecting-ip", ip);
  const request = new IncomingRequest(`${origin}${path}`, { ...init, headers });
  const ctx = createExecutionContext();
  const response = await worker.fetch(request, env, ctx);
  await waitOnExecutionContext(ctx);
  return response;
}

export function postJson(
  path: string,
  body: unknown,
  ip?: string | null,
  extraHeaders?: HeadersInit,
  origin?: string,
) {
  return call(
    path,
    {
      method: "POST",
      headers: { "content-type": "application/json", ...Object(extraHeaders) },
      body: JSON.stringify(body),
    },
    ip,
    origin,
  );
}
