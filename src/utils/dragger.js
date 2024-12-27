import dragula from 'dragula';
import 'dragula/dist/dragula.css';

const dragger = {
  init(container) {
    return dragula([...container]);
  },

  sibling({ el, wrapper, candidates, type }) {
    const idKey = `${type}Id`;
    const posKey = `${type}Pos`;
    const curId = el.dataset[idKey] * 1;

    let prev = null;
    let next = null;

    candidates.forEach((el, idx, arr) => {
      const id = el.dataset[idKey] * 1;

      if (id === curId) {
        prev =
          idx > 0
            ? {
                id: Number(arr[idx - 1].dataset[idKey]),
                pos: Number(arr[idx - 1].dataset[posKey]),
              }
            : null;
        next =
          idx < arr.length - 1
            ? {
                id: Number(arr[idx + 1].dataset[idKey]),
                pos: Number(arr[idx + 1].dataset[posKey]),
              }
            : null;
      }
    });

    return { prev, next };
  },
};

export default dragger;
