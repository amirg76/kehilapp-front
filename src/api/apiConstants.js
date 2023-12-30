import { getBaseUrl } from "@utils/envUtils";
export const BASE_URL = getBaseUrl();
export const CATEGORY_URL = `${BASE_URL}api/categories`;
export const MESSAGES_URL = `${BASE_URL}api/messages`;
export const LATEST_MESSAGES_URL = `${MESSAGES_URL}/latest`;
export const MESSAGES_BY_CATEGORY_URL = `${MESSAGES_URL}/category`;
