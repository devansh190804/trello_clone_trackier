import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../slices/modalSlice';
import { sendApiRequest } from '../../services/api';
import { useState, useEffect, useRef } from 'react';

const STATUS_OPTIONS = [
  { key: 'backlog', label: 'Backlog' },
  { key: 'in_discussion', label: 'In Discussion' },
  { key: 'todo', label: 'Todo' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

const STATUS_MAP = {
  'Backlog': 'backlog',
  'In Discussion': 'in_discussion',
  'Todo': 'todo',
  'In Progress': 'in_progress',
  'Done': 'done',
};

const getStatusKey = (labelOrKey) => {
  const found = STATUS_OPTIONS.find(opt => opt.key === labelOrKey || opt.label === labelOrKey);
  return found ? found.key : labelOrKey;
};

const EditTaskForm = ({ task, onSuccess }) => {
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      name: task.name,
      description: task.description,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      status: getStatusKey(task.status),
      assignedUserId: task.assignedUserId?._id || '',
    },
  });
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState(task.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [users, setUsers] = useState([]);
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

  useEffect(() => {
    if (users.length && task.assignedUserId && task.assignedUserId._id) {
      const found = users.find(u => u._id === task.assignedUserId._id);
      setValue('assignedUserId', found ? found._id : '');
    }
  }, [users, task.assignedUserId, setValue]);

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

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await sendApiRequest('put', `/api/task/${task._id}`, {
        name: data.name,
        description: data.description,
        projectId: task.projectId._id || task.projectId,
        assignedUserId: data.assignedUserId,
        dueDate: data.dueDate,
        tags,
        status: STATUS_MAP[data.status] || data.status,
      });
      dispatch(closeModal());
      if (onSuccess) onSuccess();
      reset();
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-96">
      <h2 className="text-lg font-semibold mb-4" style={{ color: '#172b4d' }}>Edit Task</h2>
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium" htmlFor="name">Task Title</label>
        <input
          id="name"
          className="w-full p-2 border rounded"
          {...register('name', { required: 'Task title is required' })}
          placeholder="Enter task title"
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium" htmlFor="description">Description</label>
        <textarea
          id="description"
          className="w-full p-2 border rounded"
          {...register('description')}
          placeholder="Enter description"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium" htmlFor="dueDate">Due Date</label>
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
        <label className="block mb-1 text-sm font-medium" htmlFor="assignedUserId">Assigned User</label>
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
        <label className="block mb-1 text-sm font-medium" htmlFor="status">Status</label>
        <select
          id="status"
          className="w-full p-2 border rounded"
          {...register('status', { required: 'Status is required' })}
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.key} value={opt.key}>{opt.label}</option>
          ))}
        </select>
        {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
      </div>
      <button
        type="submit"
        className="w-full p-2 rounded bg-[#0c66e4] text-white font-medium flex items-center justify-center"
        disabled={loading}
      >
        {loading ? <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span> : 'Update Task'}
      </button>
    </form>
  );
};

export default EditTaskForm; 