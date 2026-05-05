const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50">
        <div className="glass p-6 rounded-xl w-full max-w-md">
          {children}
          <button onClick={onClose} className="btn-gradient mt-4">
            Close
          </button>
        </div>
      </div>
    );
  };
  
  export default Modal;