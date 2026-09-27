export type WaitlistState = {
  status: "idle" | "success" | "error";
  message: string;
};

export const INITIAL_WAITLIST_STATE: WaitlistState = {
  status: "idle",
  message: "",
};
