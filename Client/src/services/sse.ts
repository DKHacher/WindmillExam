import { StateleSSEClient } from "statele-sse"
import {WindmillClient} from "./generated-ts-client.ts";
// import {jwtAtom} from "../atoms/authAtom.ts";

export const sse = new StateleSSEClient("http://89.168.89.95:8080/sse");
/*
const token = get(jwtAtom);
export const sse = new StateleSSEClient("http://89.168.89.95:8080/sse", {
    headers: { Authorization: `Bearer ${token}` },
});
 */
export const restClient = new WindmillClient("http://89.168.89.95:8080");