const Modal = ({ children, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-3xl bg-transparent">
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 bg-black/80 text-white rounded-full p-2 shadow-lg hover:opacity-90"
            aria-label="Close modal"
          >
            ✕
          </button>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
