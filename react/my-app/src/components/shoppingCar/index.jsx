import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import styles from './styles.module.css'
import { useCounterStore } from '../../store/index'

function ShoppingCart() {
  const [items, setItems] = useState([])
  const [itemName, setItemName] = useState('')
  const [itemPrice, setItemPrice] = useState(0)
  const inputRef = useRef(null)
  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem('items'))
    if (storedItems.length) {
      setItems(storedItems)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('items', JSON.stringify(items))
  }, [items])

  const addItem = useCallback(() => {
    if (!itemName) return
    setItems([...items, { name: itemName, price: itemPrice }])
    setItemName('')
    setItemPrice(0)
    inputRef.current.focus()
  }, [items, itemName, itemPrice])

  const removeItem = useCallback(
    (index) => {
      const newItems = [...items]
      newItems.splice(index, 1)
      setItems(newItems)
    },
    [items]
  )

  const getTotalPrice = useMemo(() => {
    return items.reduce((total, item) => total + item.price, 0)
  }, [items])

  const increment = useCounterStore((state) => state.increment)
  const decrement = useCounterStore((state) => state.decrement)
  return (
    <div className={styles.shoppingCart}>
      <div onClick={increment}>+</div>
      <div onClick={decrement}>-</div>
      <h1>Shopping Cart</h1>
      <div className={styles.form}>
        <label>
          Item Name:
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            ref={inputRef}
          />
        </label>
        <label>
          Item Price:
          <input
            type="number"
            value={itemPrice}
            onChange={(e) => setItemPrice(Number(e.target.value))}
          />
        </label>
        <button onClick={addItem}>Add Item</button>
      </div>
      <ul className={styles.itemList}>
        {items.map((item, index) => (
          <li key={index} className={styles.item}>
            <div className={styles.itemName}>{item.name}</div>
            <div className={styles.itemPrice}>${item.price}</div>
            <button
              className={styles.removeButton}
              onClick={() => removeItem(index)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p className={styles.total}>Total Price: ${getTotalPrice}</p>
    </div>
  )
}
export default ShoppingCart
