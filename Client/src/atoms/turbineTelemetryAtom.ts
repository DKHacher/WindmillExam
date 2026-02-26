import {atom} from "jotai";
import {Telemetry} from "../types/telemetry.ts";

export const turbineTelemetryAtom = atom<Telemetry[]>([]);