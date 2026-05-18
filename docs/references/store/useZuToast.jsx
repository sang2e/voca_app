import { toast } from 'react-toastify';

import { createStore } from './store';

const showToast = (options = {}) => {
  const toastId = options.toastId || `toast-${Date.now()}`;

  if (!options.toastId && toast.isActive(toastId)) return;

  const content = typeof options.render === 'function' ? options.render : options.render || null;

  toast(content, {
    toastId,
    containerId: options.containerId,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    limit: 1,
    ...options,
  });
};

export const useZuToast = createStore(
  set => ({
    showToast: options => showToast(options),
  }),
  'ToastInfo'
);
