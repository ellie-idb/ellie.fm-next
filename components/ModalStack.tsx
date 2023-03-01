import { Reducer, Fragment } from 'react';
import { RenderedModalContext } from './ModalContext';

export type ModalStack = {
  nextModalId: number;
  stack: Record<string, JSX.Element | null>
};

export const createModalStack = (): ModalStack => {
  return {
    nextModalId: 0,
    stack: {}
  };
};

export type ModalAction =
  {
    type: 'ADD_MODAL',
    element: JSX.Element,
  } |
  {
    type: 'CLOSE_MODAL',
    id: number,
  } |
  {
    type: 'CLOSE_ALL_MODALS'
  };

export const modalStackReducer: React.Reducer<ModalStack, ModalAction> = (
  state,
  action,
) => {
  const ctx = { ...state };
  switch (action.type) {
    case 'ADD_MODAL': {
      ctx.stack[ctx.nextModalId.toString()] = (
        <RenderedModalContext.Provider value={{ id: ctx.nextModalId }}>
          {action.element}
        </RenderedModalContext.Provider>
      );

      ctx.nextModalId += 1;
      return ctx;
    }
    case 'CLOSE_MODAL': {
      delete ctx.stack[action.id.toString()];
      return ctx;
    }
    case 'CLOSE_ALL_MODALS': {
      for (const [key, value] of Object.entries(ctx.stack)) {
        if (value !== null) {
          delete ctx.stack[key];
        }
      }

      ctx.stack = {};
      ctx.nextModalId = 0;
      return ctx;
    }
    default:
      return state;
  }
};

export const renderModalStack = (stack: ModalStack) => {
  return Object.entries(stack.stack)
    .filter(([_, value]) => value !== null)
    .map(([i, value]) => {
      return (
        <Fragment key={`modal-${i}`}>
          {value}
        </Fragment>
      );
    });
}

