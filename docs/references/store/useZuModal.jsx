import { createStore } from './store';

export const useZuModal = createStore(
  set => ({
    modals: [],
    modalOpen: (Component, props) =>
      set(
        state => ({
          modals: [
            ...state.modals.filter(modal => modal.Component.name !== Component.name),
            { id: Component.name, Component, props },
          ],
        }),
        false,
        '모달 열기 (modalOpen)'
      ),
    modalClose: mod =>
      set(
        state => ({
          modals: state.modals.filter(modal => modal.id !== mod.name),
        }),
        false,
        '모달 닫기 (modalClose)'
      ),
    modalCloseAll: () =>
      set(
        state => ({
          modals: [],
        }),
        false,
        '모달 전체 닫기 (modalCloseAll)'
      ),
  }),
  '모달 정보'
);
