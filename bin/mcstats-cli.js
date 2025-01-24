#!/usr/bin/env node

// Use dynamic import to avoid "require of ES module" issue
(async () => {
  const { checkServerStats } = await import('../src/mcstats.js');
  const chalk = await import('chalk');
  const Table = (await import('cli-table3')).default;

  const args = process.argv.slice(2);
  const [command, host, port, version] = args;

  if (command === 'check') {
    if (!host || !port || !version) {
      console.log(chalk.red('Usage: mcstats check <host> <port> <version>'));
      return;
    }

    console.log(chalk.green('Fetching server stats...'));

    try {
      // Fetch the stats from the Minecraft server
      const stats = await checkServerStats(host, port, version);

      // Create a table to display the stats in a clean format
      const table = new Table({
        head: ['Property', 'Value'],
        colWidths: [20, 50]
      });

      // Fill the table with server stats
      for (const [key, value] of Object.entries(stats)) {
        table.push([key, value]);
      }

      // Output the table
      console.log(table.toString());
    } catch (error) {
      console.log(chalk.red(error.message));
    }
  } else {
    console.log(chalk.red('Invalid command! Usage: mcstats check <host> <port> <version>'));
  }
})();
