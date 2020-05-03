const Telegraf = require("telegraf");

const token = "1030599418:AAF0ipsNwZjFtU1ozsBrzqUrNyy9lc-0aaw";

const bot = new Telegraf(token);

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync("db.json");
const db = low(adapter);

db.defaults({ commands: {} }).write();

bot.command("start", ctx => {
  ctx.reply(`Hello ${ctx.from.first_name}`);
});

bot.use((ctx, next) => {
  if (ctx.message.text !== undefined) {
    var regex = new RegExp("@" + bot.options.username.toLowerCase(), "i");
    ctx.message.text = ctx.message.text.replace(regex, "");
  }
  return next(ctx);
});

bot.command("ls", ctx => {
  const groupId = ctx.message.chat.id;
  const fromId = ctx.message.from.id;
  const commands1 = db.get(`commands.${groupId}`).value();
  const commands2 = db.get(`commands.${fromId}`).value();
  if (
    !db.has(`commands.${groupId}`).value() &&
    !db.has(`commands.${fromId}`).value()
  ) {
    return ctx.reply("No commands added. Yet !");
  }
  ctx.reply(
    `Group commands are :\n${
      commands1 ? Object.keys(commands1) : ""
    }\n\nPersonal commands are :\n${commands2 ? Object.keys(commands2) : ""}`
  );
});

bot.command("add", ctx => {
  const groupId = ctx.message.chat.id;
  const command = ctx.message.text.split(" ")[1];
  const reply = ctx.message.text.split("\\")[1];
  if (!command || !reply) {
    return ctx.reply(`Missing Command or Reply in Query.`);
  }
  db.set(`commands.${groupId}.${command}`, reply).write();
  ctx.reply(`Added /${command}`);
});

bot.command("remove", ctx => {
  const groupId = ctx.message.chat.id;
  const command = ctx.message.text.split(" ")[1];
  if (!command) {
    return ctx.reply("Missing Command in Query.");
  }
  db.unset(`commands.${groupId}.${ctx.message.text.split(" ")[1]}`).write();
  ctx.reply(`Removed /${ctx.message.text.split(" ")[1]}`);
});

bot.command("equals", ctx => {
  const signs = ["+", "-", "*", "/"];
  for (sign in signs) {
    if (ctx.message.text.split(sign)[1]) {
      const command = ctx.message.text.split(" ")[1];
      const left = command.split(sign)[0] ? command.split(sign)[0].trim() : 0;
      const right = command.split(sign)[1] ? command.split(sign)[1].trim() : 0;

      if (sign === "+") {
        ctx.reply(parseInt(left) + parseInt(right));
        break;
      } else if (sign === "-") {
        ctx.reply(parseInt(left) - parseInt(right));
        break;
      } else if (sign === "*") {
        ctx.reply(parseInt(left) * parseInt(right));
        break;
      } else if (sign === "/") {
        ctx.reply(parseInt(left) / parseInt(right));
        break;
      }
    }
  }
});

bot.on("message", ctx => {
  const groupId = ctx.message.chat.id;
  const fromId = ctx.message.from.id;

  const command = ctx.message.text
    ? ctx.message.text.split(" ")[0].split("/")[1]
    : "";

  if (command !== "") {
    if (db.has(`commands.${groupId}.${command}`).value()) {
      const reply = db.get(`commands.${groupId}.${command}`).value();
      ctx.reply(`${reply}`);
    } else if (db.has(`commands.${fromId}.${command}`).value()) {
      const reply = db.get(`commands.${fromId}.${command}`).value();
      ctx.reply(`${reply}`);
    }
  }
});

bot.launch();

console.log("Bot started");
