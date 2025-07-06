import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../slices/modalSlice';
import { sendApiRequest } from '../../services/api';

const DeleteProjectConfirm = ({ project, onSuccess }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await sendApiRequest('delete', `/api/project/${project._id}`);
      dispatch(closeModal());
      if (onSuccess) onSuccess();
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 text-center">
      <h2 className="text-lg font-semibold mb-4" style={{ color: '#172b4d' }}>Delete Project</h2>
      <p className="mb-6">Are you sure you want to delete this project?</p>
      <button
        onClick={handleDelete}
        className="w-full p-2 rounded bg-red-600 text-white font-medium flex items-center justify-center"
        disabled={loading}
      >
        {loading ? <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span> : 'Delete'}
      </button>
    </div>
  );
};

export default DeleteProjectConfirm; 