import { create } from "../utils/myZustand";

const useTestStore = create((set) => {
  return {
    aaa: "",
    bbb: "",
    uptAAA: (value) => {
      return set(() => ({ aaa: value }));
    },
    uptBBB: (value) => set(() => ({ bbb: value })),
  };
});
export default useTestStore;
