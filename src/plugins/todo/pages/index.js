import { Button, ButtonGroup, Card, CardHeader, View } from "@ulibs/components";

import {
  Icon,
  Table,
  TableBody,
  TableCell,
  TableFoot,
  TableHead,
  TableRow,
} from "./Input.js";

export function layout(prop){
    return View({ tag: "html" }, [
        View({ tag: "head" }, [
          View({ tag: "title" }, "Todo List"),
          View({
            tag: "link",
            rel: "stylesheet",
            href: "https://unpkg.com/@ulibs/components@next/src/styles.css",
          }),
          View({ tag: "link", rel: "stylesheet", href: "/styles.css" }),
        ]),
        View({ tag: "body", class: theme === "dark" ? "dark" : "" }, [
          template,
          View(
            { tag: "script" },
            `
          let $refs = {}
          `
          ),
          script && View({ tag: "script" }, script),
        ]),
      ])
}

let theme = "light";

export default function (req, res) {
  const table = TodoTable({ todos });

  const container = Card(
    {
      m: "sm",
      class: "todo-container",
    },
    [
      CardHeader({}, [
        "Todo List",
        ButtonGroup({}, [
          Button({ href: "/add", color: "primary" }, "Add Todo"),
          Button(
            {
              class: "u-hide-light",
              onClick() {
                fetch("/toggle-theme").then((res) => {
                  document.body.classList.toggle("dark");
                });
              },
            },
            Icon({ name: "sun" })
          ),
          Button(
            {
              class: "u-hide-dark",
              onClick() {
                fetch("/toggle-theme").then((res) => {
                  document.body.classList.toggle("dark");
                });
              },
            },
            Icon({ name: "moon" })
          ),
        ]),
      ]),
      table,
    ]
  );

  const html = render(container);

  res.send(html);
}

function TodoTable({ todos }) {
    return Table({}, [
      TableHead({}, [
        TableCell({}, "#"),
        TableCell({}, "Title"),
        TableCell({}, "Description"),
        TableCell({ style: "width: 80px" }),
      ]),
      TableBody({}, [
        todos.map((todo) =>
          TableRow({}, [
            TableCell({}, todo.id),
            TableCell({}, todo.title),
            TableCell({}, todo.description),
            TableCell({}, [
              ButtonGroup({}, [
                Button(
                  { color: "info", href: "/todos/" + todo.id },
                  Icon({ name: "pencil" })
                ),
                Button(
                  {
                    color: "error",
                    "todo-id": todo.id,
                    onClick() {
                      fetch("/todos/" + this.getAttribute("todo-id"), {
                        method: "DELETE",
                      }).then((res) => {
                        window.location.reload();
                      });
                    },
                  },
                  Icon({ name: "trash" })
                ),
              ]),
            ]),
          ])
        ),
      ]),
      TableFoot({}),
    ]);
  }

