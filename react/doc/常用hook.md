- useState: 用于在函数组件中添加局部状态
  - 状态更新是异步的,调用 setState 不会立即更新状态，而是将状态更新计划到下一个渲染中
  - 如果需要更新一个对象或数组状态，可以传递一个函数给 setState，该函数接收当前状态作为参数
    ```javascript
    const [items, setItems] = useState([]);
    setItems((prevItems) => [...prevItems, newItem]);
    ```
  - 初始状态可以是函数
    ```javascript
    const [initialValue, setInitialValue] = useState(() => {
        return someExpensiveComputation();
    });
    ```

- useEffect: 用于在函数组件中处理副作用（side effects）。副作用包括数据获取、订阅、手动更改 DOM 等
    ```javascript
    useEffect(() => {
        // 执行副作用操作
        return () => {
            // 清理副作用（可选）
        };
    }, [dependencies]); // 依赖数组
    ```
  -  副作用的执行时机
     -  如果依赖数组为空 []，副作用只会在组件挂载和卸载时执行一次
     -  如果依赖数组中有变量，副作用会在组件挂载时执行一次，并在依赖项变化时重新执行
  -  清理副作用
  -  一个组件中可以使用多个 useEffect，每个 useEffect 可以处理不同的副作用

- useLayoutEffect: useLayoutEffect 在浏览器重新布局（re-layout）之前同步执行，而 useEffect 是在浏览器完成布局和绘制之后执行
  - 同步执行: useLayoutEffect 的回调函数会在浏览器重新布局之前同步执行，这意味着你可以在这个阶段读取或修改 DOM，而不会触发额外的布局或绘制,useEffect 是在浏览器完成布局和绘制之后异步执行的
  - 由于 useLayoutEffect 是同步执行的，它可能会阻塞浏览器的布局和绘制过程，因此需要谨慎使用，避免在其中执行耗时操作

- useReducer: 适合处理复杂的状态逻辑、表单处理、状态机(react推崇数据不可变，指的是对象被创建就不能被修改，如果被修改了就创造一个新的对象)
  - 状态管理: 提供了一种更灵活的方式来管理复杂的状态逻辑,通过 reducer 函数，你可以集中管理状态的更新逻辑
  - 动作对象: 动作对象是一个描述发生什么的对象，通常包含一个 type 属性和一个可选的 payload
  - 初始状态可以通过一个值或一个函数来指定
  - 异步更新
  ```javascript
    function reducer(state, action) {
        switch (action.type) {
            case 'increment':
            return { count: state.count + 1 };
            case 'decrement':
            return { count: state.count - 1 };
            default:
            return state;
        }
    }
      const [state, dispatch] = useReducer(reducer, { count: 0 });

  ```

- useRef: 用于创建一个可变的引用对象（ref），该对象在组件的整个生命周期中保持不变
  - 跨渲染持久化: 创建的引用对象在组件的整个生命周期中保持不变，即使组件重新渲染，引用对象也不会改变
  - 常用于访问 DOM 元素，类似于类组件中的 ref 属性
  - 存储任意值: 不仅可以用于 DOM 元素，还可以存储任意值，例如定时器 ID、回调函数
  
- useForwardRef: 用于创建一个转发引用的组件，使得父组件可以通过 ref 直接访问子组件的 DOM 元素或实例
  ```javascript
    const FancyInput = forwardRef((props, ref) => {
        return <input ref={ref} {...props} />;
    });

    function ParentComponent() {
    const inputRef = useRef(null); // 创建一个 ref

    useEffect(() => {
        // 在组件加载后聚焦到输入框
        inputRef.current.focus();
    }, []);

    return <FancyInput ref={inputRef} />;
    }
  ```

- useImperativeHandle: 自定义暴露给父组件的实例值
    ```javascript
    const FancyInput = React.forwardRef((props, ref) => {
    const inputRef = useRef(null);

    // 自定义暴露给父组件的实例值
    useImperativeHandle(ref, () => ({
        focus: () => {
        inputRef.current.focus();
        },
        getValue: () => {
        return inputRef.current.value;
        }
    }));

    return <input ref={inputRef} {...props} />;
    });
    ```

- useContext: 用于在函数组件中访问 React Context 提供的值。它允许你在组件树中共享和访问全局状态，而无需通过逐层传递 props
    ```javascript
    const MyContext = React.createContext(null);
    function App() {
    const [count, setCount] = React.useState(0);

    return (
        <MyContext.Provider value={{ count, setCount }}>
        <ChildComponent />
        </MyContext.Provider>
    );
    }
    function ChildComponent() {
    const { count, setCount } = React.useContext(MyContext);

    return (
        <div>
        <p>当前计数：{count}</p>
        <button onClick={() => setCount(count + 1)}>增加</button>
        </div>
    );
    }
    ```

- useMemo：将一个值缓存起来，只有当依赖项发生变化时，才会重新计算该值
  
- useCallback: 将一个函数缓存起来，只有当依赖项发生变化时，才会重新创建该函数

hook的闭包以及解决方案
- 发生原因, 在最开始的时候会执行一次useEffect的函数，这个时候引用的count一直是0
```javascript
function App() {
    const [count,setCount] = useState(0);
    useEffect(() => {
        setInterval(() => {
            console.log(count);
            setCount(count + 1);
        }, 1000);
    }, []);
    return <div>{count}</div>
}
```
- 解决方案一：使用函数式的setCount
- 二： 设置依赖数组（不推荐）
- 三： 使用useRef