import { StateleSSEClient } from "statele-sse";
import { AuthClient, WindmillClient } from "./generated-ts-client.ts";

const BASE = "http://89.168.89.95:8080";

const http = {
    fetch: async (url: RequestInfo, init?: RequestInit) => {
        const token = sessionStorage.getItem("authToken");

        const headers = {
            ...(init?.headers ?? {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        return fetch(url, { ...init, headers });
    },
};

export const authClient = new AuthClient(BASE, http);
export const restClient = new WindmillClient(BASE, http);

export const createSSE = (): StateleSSEClient => {
    const token = sessionStorage.getItem("authToken");


    const url = token
        ? `${BASE}/sse?access_token=${encodeURIComponent(token)}`
        : `${BASE}/sse`;

    return new StateleSSEClient(url);
};