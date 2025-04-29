- Suspense: 异步组件加载：通过 React.lazy 和 Suspense，可以实现组件的懒加载，从而优化应用的性能。
    ```javascript
    import React, { Suspense, lazy } from 'react';

    // 使用 React.lazy 包装异步加载的组件
    const AsyncComponent = lazy(() => import('./AsyncComponent'));

    function App() {
    return (
        <div>
            <h1>主组件内容</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <AsyncComponent />
            </Suspense>
        </div>
    );
    }

    export default App;
    ```
- ErrorBoundary： （错误边界）是 React 中的一种特殊组件，用于捕获子组件树中的错误，并显示一个回退的 UI。只支持class组件
  - static getDerivedStateFromError(error)：会在子组件抛出错误后被调用，返回一个对象，更新组件的状态
  - componentDidCatch(error, errorInfo)：子组件抛出错误后被调用，用来记录错误信息

  
- Suspense组件捕获子组件throw的promise，ErrorBoundary捕获的是子组件throw的error


