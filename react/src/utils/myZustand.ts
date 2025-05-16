import { useSyncExternalStore, useState } from "react";
const createStore = (createState) => {
  let state: any;
  const listeners = new Set();

  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    console.log(state, nextState);
    if (!Object.is(state, nextState)) {
      const preState = state;
      if (!replace) {
        state =
          typeof nextState !== "object" || nextState === null
            ? nextState
            : Object.assign({}, state, nextState);
      } else {
        state = nextState;
      }
      listeners.forEach((listener) => listener(state, preState));
    }
  };

  const getState = () => state;

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const destroy = () => {
    listeners.clear();
  };

  const api = {
    setState,
    getState,
    subscribe,
    destroy,
  };

  state = createState(setState, getState, api);

  return api;
};

// function useStore(api, selector) {
//   const [, forceRender] = useState(0);
//   useEffect(() => {
//     // 添加副作用函数到监听
//     api.subscribe((state, prevState) => {
//       const newObj = selector(state);
//       const oldobj = selector(prevState);
//       if (newObj !== oldobj) {
//         forceRender(Math.random());
//       }
//     });
//   }, []);
//   //返回结果
//   return selector(api.getState());
// }

function useStore(api, selector) {
  function getState() {
    return selector(api.getState());
  }

  return useSyncExternalStore(api.subscribe, getState);
}

export const create = (createState) => {
  //初始化state
  const api = createStore(createState);

  const useBoundStore = (selector) => useStore(api, selector);

  Object.assign(useBoundStore, api);

  return useBoundStore;
};
