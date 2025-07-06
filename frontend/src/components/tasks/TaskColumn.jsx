import { Droppable } from 'react-beautiful-dnd';
import TaskCard from './TaskCard';
import { useDispatch } from 'react-redux';
import { openModal } from '../../slices/modalSlice';
import AddTaskForm from './AddTaskForm';

const TaskColumn = ({ status, statusKey, tasks, loading, fetchTasks, projectId }) => {
  const dispatch = useDispatch();
  const handleAddTask = () => {
    dispatch(openModal(<AddTaskForm status={status} projectId={projectId} onSuccess={fetchTasks} />));
  };
  return (
    <div className="bg-[#f4f5f7] rounded-lg shadow w-72 flex flex-col min-h-[200px]">
      <div className="font-semibold p-3 border-b border-[#dfe1e6] text-[#172b4d] flex items-center justify-between">
        {status}
      </div>
      <Droppable droppableId={statusKey}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="flex-1 p-3 min-h-[80px] flex flex-col gap-2">
            {loading ? <div className="text-center text-gray-400">Loading...</div> : tasks.map((task, idx) => (
              <TaskCard key={task._id} task={task} index={idx} fetchTasks={fetchTasks} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <button onClick={handleAddTask} className="p-2 text-[#0c66e4] hover:bg-[#e4f0f6] rounded-b">+ Add Task</button>
    </div>
  );
};

export default TaskColumn; 