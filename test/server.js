import {PluginManager} from "../src/PluginManager.js";
import {ExpressPlugin} from './plugins/expressPlugin.js'
import {PagesPlugin} from './plugins/pagePlugin.js'
import {PluginsPlugin} from './plugins/pluginPlugin.js'
import {SveltePlugin} from './plugins/sveltePlugin.js'
import {TodosPlugin} from './plugins/Todo.js'
import { getConfig } from "../src/config.js";

let allPlugins = {
  express: ExpressPlugin,
  plugins: PluginsPlugin,
  svelte: SveltePlugin,
  pages: PagesPlugin,
  todos: TodosPlugin,
};

console.log("test init step");

const manager = new PluginManager(allPlugins);

manager.init(getConfig());
