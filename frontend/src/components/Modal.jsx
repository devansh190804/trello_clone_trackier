import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { closeModal } from '../slices/modalSlice';
import { AiOutlineClose } from 'react-icons/ai';

const Modal = () => {
  const dispatch = useDispatch();
  const { isOpen, content } = useSelector((state) => state.modal);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
      <div className="relative bg-white rounded-lg shadow-lg p-10 min-w-[500px] max-w-2xl max-h-[90vh] overflow-auto flex items-center justify-center">
        <button
          onClick={() => dispatch(closeModal())}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
        >
          <AiOutlineClose />
        </button>
        <div className="w-full flex items-center justify-center">
          {content}
        </div>
      </div>
    </div>
  );
};

export default Modal; 