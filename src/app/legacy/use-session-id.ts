import { ulid } from "ulid";

import { useStorage } from "./use-storage";

export const useSessionId = () => useStorage("session-id", ulid());
