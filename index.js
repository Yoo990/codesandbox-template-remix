const express = require("express");
const app = express();
app.get("/", (req, res) => {
  res.send("Hello Express app!");
});
app.listen(3000, () => {});

const {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
} = require("discord.js");
const { createCanvas, GlobalFonts } = require("@napi-rs/canvas");
const { AttachmentBuilder } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
});

process.on("rejectionHandled", (error) => {
  console.error("Rejection Handled:", error);
});

client.once(Events.ClientReady, (c) => {
  console.log(`[Logged in as] ${client.user.tag}`);
  console.log(`[ID Bot] ${client.user.id}`);
  console.log(`[Guilds Bot] ${client.guilds.cache.size}`);
  client.user.setActivity(`[ Developed By Yosof ]`);
});

const prefix = "!";
let lastSentMessage = null;

GlobalFonts.registerFromPath('./Cairo-Regular.ttf', 'Cairo');

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;
  if (message.content.startsWith(prefix + "h") || message.content.startsWith(prefix + "help")) {
    message.channel.send({
      content: `Hello ${message.author}`,
      embeds: [
        new EmbedBuilder()
          .setTitle('Cut Tweet Bot')
          .setDescription(`Developer Name: Yosof`)
          .addFields(
            { name: `${message.guild.name}`,
              value: `Cmd : (كت or Cut) + Prefix 
Bot Prefix : ${prefix} `
            }
          )
          .setThumbnail(message.guild.iconURL({ dynamic: true }))
          .setTimestamp()
          .setColor("#070809")
      ],
    });
  }
});  

client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;
  if (message.content.startsWith(`<@${client.user.id}>`)) {
    message.channel.send({
      content: `hi ${message.author} 
my prefix is ${prefix}`
    });
  }
});

client.on("messageCreate", async (message) => {
  if (message.content === prefix + "كت" || 
      message.content === prefix + "cut") {

    const random = [
      "ولك الووووو"
    ];

    const result = random[Math.floor(Math.random() * random.length)];
    console.log("Random result:", result);

    if (lastSentMessage === result) {
      console.log("Message already sent, skipping...");
      return;
    }

    lastSentMessage = result;

    const canvas = createCanvas(769, 336);
    const context = canvas.getContext("2d");

    context.fillStyle = "#000000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.font = "40px 'Cairo'";
    context.fillStyle = "#ffffff";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(result, canvas.width / 2, canvas.height / 2);

    const buffer = canvas.toBuffer("image/png");
    const attachment = new AttachmentBuilder(buffer, {
      name: "result-image.png",
    });

    try {
      console.log("Sending message");
      await message.delete();
      await message.channel.send({ files: [attachment] });
      console.log("Message sent");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  } else {
    lastSentMessage = null;
  }
});

client.login(process.env.token);