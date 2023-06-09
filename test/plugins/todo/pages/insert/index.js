import {
  Input,
  Modal,
  ModalBody,
} from "./Input.js";

export const actions = {
  addTodo(req, res, ctx, {totoTitle, todoDescription}){
    ctx.addTodo({todoTitle, todoDescription})
  }
}

export default function(req, res) {
    return View({}, [
      Modal({ open: true, persistent: true, id: "add-todo-modal" }, [
        ModalBody({}, [AddTodoForm({})]),
      ]),
    ]);
}


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