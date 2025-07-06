import { Draggable } from 'react-beautiful-dnd';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { openModal } from '../../slices/modalSlice';
import EditTaskForm from './EditTaskForm';
import { sendApiRequest } from '../../services/api';

const getAvatarUrl = (name) => {
  if (!name) return '';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name.charAt(0))}&background=0c66e4&color=fff&size=32&rounded=true`;
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
};

const TaskCard = ({ task, index, fetchTasks }) => {
  const dispatch = useDispatch();
  const handleEdit = (e) => {
    e.stopPropagation();
    dispatch(openModal(<EditTaskForm task={task} onSuccess={fetchTasks} />));
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(openModal(
      <div className="w-80 text-center">
        <h2 className="text-lg font-semibold mb-4" style={{ color: '#172b4d' }}>Delete Task</h2>
        <p className="mb-6">Are you sure you want to delete this task?</p>
        <button
          onClick={async () => {
            await sendApiRequest('delete', `/api/task/${task._id}`);
            dispatch(openModal(null));
            fetchTasks();
          }}
          className="w-full p-2 rounded bg-red-600 text-white font-medium flex items-center justify-center"
        >
          Delete
        </button>
      </div>
    ));
  };
  const userName = task.assignedUserId?.userName || '';
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="bg-white rounded-xl shadow p-4 mb-2 cursor-pointer min-h-[120px] group relative transition-all"
        >
          {task.coverImage && (
            <img
              src={task.coverImage}
              alt="cover"
              className="w-full h-32 object-cover rounded-t-xl mb-2"
            />
          )}
          <div className="font-medium text-[#172b4d] break-words whitespace-pre-line max-w-full">{task.name}</div>
          <div className="text-sm text-[#5e6c84] break-words whitespace-pre-line max-w-full">{task.description}</div>
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={handleEdit}
              className="bg-white rounded-full p-1 shadow text-[#0c66e4] hover:bg-blue-50"
            >
              <FiEdit2 size={18} />
            </button>
            <button
              onClick={handleDelete}
              className="bg-white rounded-full p-1 shadow text-[#e11d48] hover:bg-red-50"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
          <div className="absolute bottom-2 left-2 flex items-center gap-2">
            {task.dueDate && (
              <span className="px-2 py-1 rounded border border-gray-300 text-xs text-gray-600 bg-gray-50">
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>
          {userName && (
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <span className="text-xs text-gray-400">Assigned to</span>
              <img
                src={getAvatarUrl(userName)}
                alt={userName}
                className="w-8 h-8 rounded-full border-2 border-white shadow"
                title={userName}
              />
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard; 