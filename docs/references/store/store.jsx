import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export const createStore = (initializer, storeName) =>
  create(
    devtools(immer(initializer), {
      name: storeName,
      enabled: true,
      anonymousActionType: storeName,
      logOnly: false,
    })
  );
