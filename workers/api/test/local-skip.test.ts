import { describe, expect, it } from "vitest";
import { postJson } from "./helpers";

const CONTACT = {
  name: "Ada Lovelace",
  email: "ada@creova.one",
  message: "Hello from the local test env",
};

const BOOKING = {
  service: "Photography",
  name: "Ada Lovelace",
  email: "ada@creova.one",
  phone: "555-0100",
};

describe("local captcha skip", () => {
  it("accepts contact and booking when CREOVA_ENV=test and the always-pass dummy is set", async () => {
    const contact = await postJson("/make-server-feacf0d8/submit-contact", CONTACT, "203.0.113.61");
    expect(contact.status).toBe(200);
    const contactBody = (await contact.json()) as { status?: string; contactId?: string };
    expect(contactBody.status).toBe("success");
    expect(contactBody.contactId?.startsWith("contact_")).toBe(true);

    const booking = await postJson("/make-server-feacf0d8/submit-booking", BOOKING, "203.0.113.62");
    expect(booking.status).toBe(200);
    const bookingBody = (await booking.json()) as { status?: string; bookingId?: string };
    expect(bookingBody.status).toBe("success");
    expect(bookingBody.bookingId?.startsWith("booking_")).toBe(true);
  });
});
