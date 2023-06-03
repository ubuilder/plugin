import Todo from '../src/plugins/Todo.js'
import PluginManager  from '../src/classes/PluginManager.js'
import Context from '../src/classes/Context.js'

let manager = new PluginManager()

let todo = new Todo()

manager.add(todo)

manager.install(todo)

manager.start()

console.log("ctx: ", Context.ctx )


