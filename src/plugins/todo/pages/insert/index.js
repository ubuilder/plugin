import {
  Input,
  Modal,
  ModalBody,
} from "./Input.js";



function AddTodoForm($props) {
    const { mode, title, description, id } = $props;
  
    return View(
      {
        tag: "form",
        action: mode === "edit" ? "/todos/" + id : "/todos",
        method: "post",
        class: "add-todo-form",
      },
      [
        Input({
          name: "title",
          label: "Title:",
          ref: "title",
          value: title,
          placeholder: "Enter new todo...",
        }),
        Input({
          name: "description",
          label: "Description:",
          ref: "description",
          value: description,
          placeholder: "Enter todo description...",
        }),
        Button(
          {
            color: "primary",
          },
          mode === "edit" ? "Update" : "Add"
        ),
      ]
    );
  }
 export default function(req, res) {
    const component = View({}, [
      Modal({ open: true, persistent: true, id: "add-todo-modal" }, [
        ModalBody({}, [AddTodoForm({})]),
      ]),
    ]);
  
    const html = render(component);
  
    res.send(html);
}
export function post(req, res){
    console.log(req.body);
    todos.push({
      title: req.body.title,
      description: req.body.description,
      id: todos.length > 0 ? todos[todos.length - 1].id + 1 : 1,
    }); 
    res.redirect("/");
}