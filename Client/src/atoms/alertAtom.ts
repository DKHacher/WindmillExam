import {WindmillAlertEntity} from "../services/generated-ts-client.ts";
import {atom} from "jotai";

export const alertAtom = atom<WindmillAlertEntity[]>([])