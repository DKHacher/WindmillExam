import {atom} from "jotai";
import {WindmillTelemetryEntity} from "../services/generated-ts-client.ts";

export const windmillAtom = atom<WindmillTelemetryEntity[]>([]);