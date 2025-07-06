import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../slices/modalSlice';
import { useForm } from 'react-hook-form';
import { sendApiRequest } from '../../services/api';

const CreateProjectForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await sendApiRequest('post', '/api/project', {
        title: data.title,
        description: data.description,
      });
      dispatch(closeModal());
      if (onSuccess) onSuccess();
      reset();
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-80">
      <h2 className="text-lg font-semibold mb-4" style={{ color: '#172b4d' }}>Create Project</h2>
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium" htmlFor="title">Project Title</label>
        <input
          id="title"
          className="w-full p-2 border rounded"
          {...register('title', { required: 'Project title is required' })}
          placeholder="Enter project title"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium" htmlFor="description">Description</label>
        <textarea
          id="description"
          className="w-full p-2 border rounded"
          {...register('description', { required: 'Description is required' })}
          placeholder="Enter description"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>
      <button
        type="submit"
        className="w-full p-2 rounded bg-[#0c66e4] text-white font-medium flex items-center justify-center"
        disabled={loading}
      >
        {loading ? <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span> : 'Create Project'}
      </button>
    </form>
  );
};

export default CreateProjectForm; 