#!/usr/bin/env node

const getServerStats = require("../lib/mcstats");
const chalk = require("chalk");
const Table = require("cli-table3");

const args = process.argv.slice(2);

if (args.length < 3) {
  console.log(chalk.red("Usage: mcstats <command> <address> <port> <type>"));
  console.log(chalk.blueBright("\nCommands:"));
  console.log(`  ${chalk.green("check")}  - Check the status of a server`);
  process.exit(1);
}

const command = args[0];
const address = args[1];
const port = args[2];
const type = args[3] || "java";

if (command === "check") {
  getServerStats(`${address}:${port}`, type)
    .then((stats) => {
      if (stats.online) {
        console.log(chalk.green("\n=== Server is Online ===\n"));

        const serverTable = new Table({
          head: [chalk.cyan("Property"), chalk.cyan("Value")],
          colWidths: [20, 40],
        });

        serverTable.push(
          ["IP", stats.ip || "Unknown"],
          ["Port", stats.port || "Unknown"],
          ["Hostname", stats.hostname || "None"],
          ["Version", stats.version || "Unknown"],
          ["Players", `${stats.players.online}/${stats.players.max}`],
          ["MOTD", stats.motd.clean.join("\n")]
        );

        console.log(serverTable.toString());
      } else {
        console.log(chalk.red("\n=== Server is Offline ===\n"));

        const debugTable = new Table({
          head: [chalk.cyan("Debug Property"), chalk.cyan("Value")],
          colWidths: [30, 30],
        });

        for (const [key, value] of Object.entries(stats.debug)) {
          debugTable.push([key, value ? "True" : "False"]);
        }

        console.log(debugTable.toString());
      }
    })
    .catch((error) => {
      console.error(chalk.red("\nError:"), chalk.yellow(error.message));
    });
} else {
  console.log(chalk.red(`Unknown command: ${command}`));
}
