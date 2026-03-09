import { StateleSSEClient } from "statele-sse"
import {WindmillClient} from "./generated-ts-client.ts";

// Placeholder URLs
export const sse = new StateleSSEClient("http://localhost:5075/sse");
export const restClient = new WindmillClient("http://localhost:5075");