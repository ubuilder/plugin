import {PluginManager} from "../src/classes/PluginManager.js";
import {ExpressPlugin} from '../src/plugins/expressPlugin.js'
import {PagesPlugin} from '../src/plugins/pagePlugin.js'
import {PluginsPlugin} from '../src/plugins/pluginPlugin.js'
import {SveltePlugin} from '../src/plugins/sveltePlugin.js'
import {TodosPlugin} from '../src/plugins/Todo.js'
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
