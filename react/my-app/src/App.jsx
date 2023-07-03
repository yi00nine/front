import styles from './styles.module.css'
import TodoList from './components/todoList/index'
import ShopCar from './components/shoppingCar/index'
import { useState } from 'react'
import { useCounterStore } from './store/index'
function App() {
  const [state, setState] = useState(1)
  const count = useCounterStore((state) => state.count)
  return (
    <div className={styles.App}>
      <button onClick={() => setState(1)}>todoList</button>
      <button onClick={() => setState(2)}>shopCar</button>
      <div className={styles.count}>{count}</div>
      {state === 1 ? <TodoList></TodoList> : <ShopCar></ShopCar>}
    </div>
  )
}

export default App
