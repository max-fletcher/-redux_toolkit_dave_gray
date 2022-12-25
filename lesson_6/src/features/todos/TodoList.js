// add imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useState } from "react"
// import the RTK Queries defined in apiSlice
import { useGetTodosQuery, useAddTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation } from '../api/apiSlice'

const TodoList = () => {
    const [newTodo, setNewTodo] = useState('')

    // Destructuring and getting all the necessary data that the provider is providing us with, including isLoading(bool), isSuccess(bool),
    // isError(bool) and error(string). We are, however, renaming "data" to "todos" here so it is more understandable.
    const {
        data: todos,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTodosQuery()
    // Importing all the functions that the the provider is providing us with.
    const [addTodo] = useAddTodoMutation()
    const [updateTodo] = useUpdateTodoMutation()
    const [deleteTodo] = useDeleteTodoMutation()

    const handleSubmit = (e) => {
        e.preventDefault();
        // **IMPORTANT: Its important to remember that "id" is automatically provided by RTK Query based on latest "todo"/data. So we
        // don't need to pass it manually into this function
        addTodo({ userId: 1, title: newTodo, completed: false })
        setNewTodo('')
    }

    const newItemSection =
        <form onSubmit={handleSubmit}>
            <label htmlFor="new-todo">Enter a new todo item</label>
            <div className="new-todo">
                <input
                    type="text"
                    id="new-todo"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Enter new todo"
                />
            </div>
            <button className="submit">
                <FontAwesomeIcon icon={faUpload} />
            </button>
        </form>


    let content;
    if (isLoading){
        content = <p> Loading... </p>
    } else if(isSuccess) {
        content = todos.map((todo) => {
            console.log(todo);
            return(
                <article key={todo.id}>
                    <div className="todo">
                        <input
                            type="checkbox"
                            checked={todo.completed} //set checked to true/false based on "completed status"
                            id={todo.id} // works in conjunction with "htmlFor" in the label tag
                            // Detrtucturing and sending data to updateTodo, but with "completed" status changed/toggled
                            onChange={() => updateTodo({ ...todo, completed: !todo.completed })}
                        />
                        {/* "id" in inout tag works in conjunction with "htmlFor" in the label tag */}
                        <label htmlFor={todo.id}>{todo.title}</label> 
                    </div>
                    <button className='trash' onClick={() => deleteTodo({ id: todo.id })}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </article>
            )
        })
    } else if (isError) {
        content = <p> {error} </p>
    }
    // Define conditional content

    return (
        <main>
            <h1>Todo List</h1>
            {newItemSection}
            {content}
        </main>
    )
}
export default TodoList