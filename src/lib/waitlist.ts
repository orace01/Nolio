/* The form shows the message for the status in the visitor's language */
export type WaitlistState = {
  status: "idle" | "success" | "error";
};

export const INITIAL_WAITLIST_STATE: WaitlistState = { status: "idle" };
