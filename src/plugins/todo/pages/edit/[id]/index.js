import {
  Modal,
  ModalBody,
} from "./Input.js";


export function post({params}){
    const todo = todos.find((x) => x.id === +req.params.id);
    if (!todo) res.redirect("/");
  
    console.log(todo);
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

