import { PluginManager } from "../src/PluginManager";

let ctx = {}
let pm = PluginManager({config: './pm.config.json', ctx: ctx})

//imports the methods of plugin1 and plugin2 from plugins folder to plugins[] array
//if not loaded rest of the method wount work
await pm.loadPlugins('./plugins')

//runs oninstall and push to config.json file and set the status to active:false
await pm.install('plugin1')
await pm.install('plugin2')

//run on enable method and changes  the state of plugins to ative:true
await pm.enable('plugin1')
await pm.enable('plugin2')

//starts all the plugins that are installed and enabled
await pm.start()

//if you want to diable not remove
// await pm.disable('plugin1')
// await pm.disable('plugin2')

//if you want to remove all together
// await pm.remove('plugin1')
// await pm.remove('plugin2')




