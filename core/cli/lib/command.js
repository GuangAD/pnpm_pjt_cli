// import { program, Command } from 'commander'
// import module from 'module'
// const require = module.createRequire(import.meta.url)
// const pkg = require('../package.json')

// program
//   .name(Object.keys(pkg.bin)[0])
//   .usage('<command> [options]')
//   .version(pkg.version)
//   .option('-d, --debug', '是否开启调试模式', true)
//   .option('-e, --env <env_name>', '获取环境变量名称')

// // console.log(program.opts());

// const clone = program.command('clone <a> <b> [c]');
// clone
//   .description('clone description')
//   .alias('c')
//   .option('-f, --force <is_force>', '是否强制克隆')
//   .action((a, b, c, opts) => {
//     console.log('do clone');
//     console.log(a, b, c);
//     console.log(opts);
//   })
// // wk clone a b c -f a
// // wk clone -f a a b c
// // wk clone a b -f a c
// // wk clone 1 2 -f a

// // 定义一个命令，在一个单独的可执行文件中实现
// // 执行目录npm项目中的可执行文件
// // 加上前缀执行....
// // wk-in
// const install = program.command('install [name]', 'inin', {
//   executableFile: "lerna",
//   // isDefault: true,
//   hidden: true
// });
// install
//   .description('clone description')
//   .alias('i')
//   .action((name) => {
//     console.log(name);
//   })

// const service = new Command('service')
// service
//   .command('start [port]', {})
//   .action((port) => {
//     console.log(`run service at port ${port}`);
//   })
// service
//   .command('stop [port]', {})
//   .action((port) => {
//     console.log(`stop service at port ${port}`);
//   })

// program.addCommand(service)

// program
//   .arguments('<cmd> [options]')
//   .description('other command')
//   .action((cmd, options) => {
//     console.log(cmd, options);
//     console.log("匹配未注册的command");
//   })

// // 自定义help
// program.helpInformation = function () {
//   // return 'xxxxxxxxxxx'
//   return '';
// }

// program.on('--help', function () {
//   return 'xxxxxxxxxxx'
// })

// // 实现debug
// // 早于 command action
// program.on('option:debug', function () { })

// // 未知命令监听
// program.on('command:*', function () { })

// program.parse(process.argv)
