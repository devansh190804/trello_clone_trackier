import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../slices/modalSlice';
import { sendApiRequest } from '../../services/api';
import { useState, useEffect, useRef } from 'react';

const STATUS_MAP = {
  'Backlog': 'backlog',
  'In Discussion': 'in_discussion',
  'Todo': 'todo',
  'In Progress': 'in_progress',
  'Done': 'done',
};

const LANDSCAPE_IMAGES = [
  'https://img.freepik.com/free-photo/majestic-mountain-landscape_181624-46399.jpg',
  'https://img.freepik.com/free-photo/beautiful-shot-mountain-landscape-with-greenery-cloudy-sky_181624-26647.jpg',
  'https://img.freepik.com/free-photo/beautiful-shot-mountain-landscape_181624-26646.jpg',
  'https://img.freepik.com/free-photo/beautiful-shot-mountain-landscape-with-greenery-cloudy-sky_181624-26647.jpg',
  'https://img.freepik.com/free-photo/majestic-mountain-landscape_181624-46399.jpg',
  'https://img.freepik.com/free-photo/green-mountains-with-cloudy-sky_181624-26645.jpg',
  'https://img.freepik.com/free-photo/snowy-mountain-peak-blue-sky_181624-26644.jpg',
  'https://img.freepik.com/free-photo/river-between-green-mountains_181624-26643.jpg',
  'https://img.freepik.com/free-photo/forest-mountains-fog_181624-26642.jpg',
  'https://img.freepik.com/free-photo/beautiful-lake-mountains_181624-26641.jpg',
];

const AddTaskForm = ({ status, projectId, onSuccess }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [users, setUsers] = useState([]);
  const [coverImage, setCoverImage] = useState('');
  const [coverLoading, setCoverLoading] = useState(false);
  const tagInputRef = useRef();

  useEffect(() => {
    sendApiRequest('get', '/api/user')
      .then(res => {
        if (res.success && Array.isArray(res.users)) setUsers(res.users);
        else setUsers([]);
      })
      .catch(() => setUsers([]));
  }, []);

  useEffect(() => {
    setValue('tags', tags);
  }, [tags, setValue]);

  const onTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter(t => t !== tag));
  };

  const today = new Date().toISOString().split('T')[0];

  const fetchRandomCover = () => {
    setCoverLoading(true);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * LANDSCAPE_IMAGES.length);
      setCoverImage(LANDSCAPE_IMAGES[idx]);
      setCoverLoading(false);
    }, 300);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await sendApiRequest('post', '/api/task', {
        name: data.title,
        description: data.description,
        projectId,
        assignedUserId: data.assignedUserId,
        dueDate: data.dueDate,
        tags,
        status: STATUS_MAP[status] || status,
        coverImage: coverImage || undefined,
      });
      dispatch(closeModal());
      if (onSuccess) onSuccess();
      reset();
      setTags([]);
      setCoverImage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-96">
      <div className="mb-4 flex flex-col items-center">
        <button
          type="button"
          onClick={fetchRandomCover}
          className="mb-2 px-4 py-1 rounded bg-[#0c66e4] text-white font-medium text-sm shadow hover:bg-[#0052cc]"
          disabled={coverLoading}
        >
          {coverLoading ? 'Loading...' : 'Add Random Cover Image'}
        </button>
        {coverImage && (
          <img src={coverImage} alt="cover" className="rounded w-full max-h-40 object-cover mb-2" />
        )}
      </div>
      <h2 className="text-lg font-semibold mb-4" style={{ color: '#172b4d' }}>Add Task</h2>
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium" htmlFor="title">
          <span className="text-red-500">*</span> Task Title
        </label>
        <input
          id="title"
          className="w-full p-2 border rounded"
          {...register('title', { required: 'Task title is required' })}
          placeholder="Enter task title"
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium" htmlFor="description">
          <span className="text-red-500">*</span> Description
        </label>
        <textarea
          id="description"
          className="w-full p-2 border rounded"
          {...register('description')}
          placeholder="Enter description"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium" htmlFor="dueDate">
          <span className="text-red-500">*</span> Due Date
        </label>
        <input
          id="dueDate"
          type="date"
          className="w-full p-2 border rounded"
          min={today}
          {...register('dueDate', { required: 'Due date is required' })}
        />
        {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Tags</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map(tag => (
            <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center gap-1">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="ml-1 text-blue-600">×</button>
            </span>
          ))}
        </div>
        <input
          ref={tagInputRef}
          type="text"
          className="w-full p-2 border rounded"
          value={tagInput}
          onChange={e => setTagInput(e.target.value)}
          onKeyDown={onTagKeyDown}
          placeholder="Type tag and press Enter"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium" htmlFor="assignedUserId">
          <span className="text-red-500">*</span> Assigned User
        </label>
        <select
          id="assignedUserId"
          className="w-full p-2 border rounded"
          {...register('assignedUserId', { required: 'Assigned user is required' })}
        >
          <option value="">Select user</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.userName}</option>
          ))}
        </select>
        {errors.assignedUserId && <p className="text-red-500 text-xs mt-1">{errors.assignedUserId.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium">Status</label>
        <input
          className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
          value={status}
          disabled
        />
      </div>
      <button
        type="submit"
        className="w-full p-2 rounded bg-[#0c66e4] text-white font-medium flex items-center justify-center"
        disabled={loading}
      >
        {loading ? <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span> : 'Add Task'}
      </button>
    </form>
  );
};

export default AddTaskForm; 