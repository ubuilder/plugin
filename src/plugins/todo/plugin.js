import { BasePlugin } from "../../classes/Plugin.js";
import * as homePage from './pages/index.js'
import * as inserForm from './pages/inser/index.js'
import * as editForm from './pages/edit/index.js'
import * as settingPage from './admin/setting.js'

export class TodosPlugin extends BasePlugin {
  onInit(ctx) {
    //pages
    // ctx.router.addPage('/todos', homePage)
    // ctx.router.addPage('/todos/edit', editForm)
    // ctx.router.addPage('/todos/inser', inserForm)

    //this works the same as above
    ctx.router.addFileBasedRoutes('./pages', routePrifix='todos')

    //admin panel pages
    ctx.router.addPage('admin/todos/setting', settingPage)
    ctx.router.addPage('admin/todos/config', configPage)
    ctx.router.addPage('admin/todos/something', somethingPage)

    const sidebarItem = {
        title: "Todo Plugin", 
        children: [
            {
                title: 'setting',
                href: 'admin/todos/setting'
            },
            {
                title: 'config',
                href: 'admin/todos/config'
            },
            {
                title: 'someting',
                href: 'admin/todos/something'
            }
        ]
    }

    //for adding the Todo to side bar of admin panel
    ctx.addSideBarItem(sidebarItem)

    console.log("todosPlugin onInit");
  }
}
