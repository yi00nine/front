import React, { useState, useEffect } from 'react'
import styles from './styles.module.css'
import { useCounterStore } from '../../store/index'

function TodoList() {
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos'))
    if (storedTodos.length) {
      setTodos(storedTodos)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    if (inputValue.trim() !== '') {
      setTodos([...todos, { text: inputValue.trim(), completed: false }])
      setInputValue('')
    }
  }
  const handleTodoDelete = (index) => {
    const newTodos = [...todos]
    newTodos.splice(index, 1)
    setTodos(newTodos)
  }

  const handleTodoCompleted = (index) => {
    const newTodos = [...todos]
    newTodos[index].completed = true
    setTodos(newTodos)
  }
  const increment = useCounterStore((state) => state.increment)
  const decrement = useCounterStore((state) => state.decrement)
  return (
    <div className={styles.main}>
      <div onClick={increment}>+</div>
      <div onClick={decrement}>-</div>
      <h1>TodoList</h1>
      <form onSubmit={handleFormSubmit}>
        <input type="text" value={inputValue} onChange={handleInputChange} />
        <button>add</button>
      </form>
      <ul>
        {todos.map((todo, index) => (
          <li
            key={index}
            className={`${todo.completed ? styles.completed : ''}`}
          >
            <span>{todo.text}</span>
            <button onClick={() => handleTodoDelete(index)}>Delete</button>
            {!todo.completed && (
              <button onClick={() => handleTodoCompleted(index)}>
                Complete
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
export default TodoList
