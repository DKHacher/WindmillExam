import { atom } from 'jotai';
import {WindmillTelemetryDTO} from "../services/generated-ts-client.ts";

export const telemetryAtom = atom<WindmillTelemetryDTO[]>([]);