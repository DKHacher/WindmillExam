import { StateleSSEClient } from "statele-sse"
import {WindmillClient} from "./generated-ts-client.ts";

export const sse = new StateleSSEClient("http://89.168.89.95:8080/sse");
export const restClient = new WindmillClient("http://89.168.89.95:8080");