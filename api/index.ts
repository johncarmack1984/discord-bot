const {
  InteractionResponseType,
  InteractionType,
  verifyKey,
} = require("discord-interactions");
const getRawBody = require("raw-body");

export const HUG_COMMAND = {
  name: "hug",
  description: "Sometimes you gotta hug someone",
  options: [
    {
      name: "user",
      description: "The user to hug",
      type: 6,
      required: true,
    },
  ],
};

export const INVITE_COMMAND = {
  name: "invite",
  description: "Get an invite link to add the bot to your server",
};

const INVITE_URL = `https://discord.com/oauth2/authorize?client_id=${process.env.APPLICATION_ID}&scope=applications.commands`;

/**
 * Gotta see someone 'bout a trout
 * @param {VercelRequest} request
 * @param {VercelResponse} response
 */
export default async (request, response) => {
  if (request.method === "GET") {
    response.status(200).send(`<a href="${INVITE_URL}">${INVITE_URL}</a>`);
  }
  if (request.method === "POST") {
    const signature = request.headers["x-signature-ed25519"];
    const timestamp = request.headers["x-signature-timestamp"];
    const rawBody = await getRawBody(request);
    console.log();

    const isValidRequest = verifyKey(
      rawBody,
      signature,
      timestamp,
      process.env.PUBLIC_KEY
    );

    if (!isValidRequest) {
      console.error("Invalid Request");
      return response.status(401).send({ error: "Bad request signature " });
    }

    const message = request.body;

    if (message.type === InteractionType.PING) {
      console.log("Handling Ping request");
      response.send({
        type: InteractionResponseType.PONG,
      });
    } else if (message.type === InteractionType.APPLICATION_COMMAND) {
      switch (message.data.name.toLowerCase()) {
        case HUG_COMMAND.name.toLowerCase():
          response.status(200).send({
            type: 4,
            data: {
              content: `*<@${message.member.user.id}> hugs <@${message.data.options[0].value}>*`,
            },
          });
          console.log("hug Request");
          break;
        case INVITE_COMMAND.name.toLowerCase():
          response.status(200).send({
            type: 4,
            data: {
              content: INVITE_URL,
              flags: 64,
            },
          });
          console.log("Invite request");
          break;
        default:
          console.error("Unknown Command");
          response.status(400).send({ error: "Unknown Type" });
          break;
      }
    } else {
      console.error("Unknown Type");
      response.status(400).send({ error: "Unknown Type" });
    }
  }
};
