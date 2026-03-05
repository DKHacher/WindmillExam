import { atom } from 'jotai';
export const jwtAtom = atom(sessionStorage.getItem('authToken') || '');