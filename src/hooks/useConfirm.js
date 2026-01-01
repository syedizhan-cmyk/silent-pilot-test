import { create } from 'zustand';

// Global state for confirmation dialog
export const useConfirmStore = create((set) => ({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Yes',
  cancelText: 'No',
  onConfirm: () => {},
  
  showConfirm: ({ title, message, confirmText = 'Yes', cancelText = 'No' }) => 
    new Promise((resolve) => {
      set({
        isOpen: true,
        title,
        message,
        confirmText,
        cancelText,
        onConfirm: () => {
          set({ isOpen: false });
          resolve(true);
        },
      });
    }),
  
  close: () => {
    set({ isOpen: false });
  }
}));

// Hook to use in components
export const useConfirm = () => {
  const showConfirm = useConfirmStore((state) => state.showConfirm);
  
  return {
    confirm: showConfirm
  };
};
