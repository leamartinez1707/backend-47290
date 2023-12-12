import { Command } from "commander";

const program = new Command()

program.option('--mode <mode>', 'Modo de ejecución', 'production')

program.parse()

export default program