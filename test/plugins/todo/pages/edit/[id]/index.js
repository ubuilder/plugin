import {
  Modal,
  ModalBody,
} from "./Input.js";

export const actions = {
  editTodo(req, res, ctx ,{todoId, tdoTitle, todoDescription}){
    //editTodo() is define in plugins/todo/index.js
    ctx.editTodo(todoId, {todoId, tdoTitle, todoDescription})
    res.send("success")
  }
}

export default function({params}){
  //this should return edit form
    const component = View({}, [
      Modal({ open: true, persistent: true, id: "add-todo-modal" }, [
        ModalBody({}, [
          AddTodoForm({
            mode: "edit",
            title: todo.title,
            description: todo.description,
            id: todo.id,
          }),
        ]),
      ]),
    ]);
  
    const html = render(component);

    res.send(html);
}

