import fetch from "node-fetch";
import { INVITE_COMMAND, HUG_COMMAND } from "./api";

const response = await fetch(
  `https://discord.com/api/v8/applications/${process.env.APPLICATION_ID}/commands`,
  {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
    },
    method: "PUT",
    body: JSON.stringify([INVITE_COMMAND, HUG_COMMAND]),
  }
);

if (response.ok) {
  console.log("Registered all commands");
} else {
  console.error("Error registering commands");
  const text = await response.text();
  console.error(text);
}
