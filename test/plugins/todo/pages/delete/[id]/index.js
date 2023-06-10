export const actions ={
    deleteTodo : (req, res, ctx, {todoId})=>{
        ctx.deleteTodo({todoId})
    }
}