import { createContext, Dispatch } from 'react';
import { ModalStack, ModalAction } from './ModalStack';

export type RenderedModalContext = {
  id: number;
};

export const RenderedModalContext = createContext<RenderedModalContext>(undefined!);

export type ModalContext = {
  stack: ModalStack;
  dispatch: Dispatch<ModalAction>;
};

export const createModalContext = () => {
  return {
    stack: { nextModalId: 0, stack: {} }
  } as ModalContext
}

export const ModalContext = createContext<ModalContext>(undefined!);