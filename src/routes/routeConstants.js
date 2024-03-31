import { currentEndPointHelper } from "@utils/currentEndPointHelper";

export const ROOT = `/${currentEndPointHelper()}`;
// export const LOGIN = "/login";
export const LOGIN = `/${currentEndPointHelper()}/login`;
// export const MESSAGES = "/messages";
export const MESSAGES = `/${currentEndPointHelper()}/messages`;
