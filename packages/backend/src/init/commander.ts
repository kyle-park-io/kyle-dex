import { Command } from 'commander';

const program = new Command();

export function setupCLI(): void {
  program
    .name('kyle-dex-cli')
    .description('CLI to start kyle-dex server')
    .version('1.0.0')
    .option(
      '-o, --offline',
      'Run server in offline mode (not running hardhat network)',
    )
    .action((options) => {
      if (options.offline as boolean) {
        process.env.hardhat = '0';
        process.env.sepolia = '0';
        process.env.amoy = '0';
      }
    });

  program.parse(process.argv);
}
