import { useEffect, useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskColumn from './TaskColumn';
import { sendApiRequest } from '../../services/api';

const STATUS_MAP = [
  { key: 'backlog', label: 'Backlog' },
  { key: 'in_discussion', label: 'In Discussion' },
  { key: 'todo', label: 'Todo' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

const TasksBoard = ({ projectId }) => {
  const [tasksByStatus, setTasksByStatus] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchTasks = () => {
    setLoading(true);
    sendApiRequest('get', `/api/task?projectId=${projectId}`)
      .then(res => {
        if (res.success && typeof res.tasks === 'object') setTasksByStatus(res.tasks);
        else setTasksByStatus({});
      })
      .catch(() => setTasksByStatus({}))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  // Map backend keys to frontend keys if needed
  const normalizeTasksByStatus = (raw) => {
    const keyMap = {
      'Backlog': 'backlog',
      'In Discussion': 'in_discussion',
      'Todo': 'todo',
      'In Progress': 'in_progress',
      'Done': 'done',
      'backlog': 'backlog',
      'in_discussion': 'in_discussion',
      'todo': 'todo',
      'in_progress': 'in_progress',
      'done': 'done',
    };
    const normalized = {};
    Object.entries(raw || {}).forEach(([k, v]) => {
      const mappedKey = keyMap[k] || k;
      normalized[mappedKey] = v;
    });
    return normalized;
  };

  const normalizedTasksByStatus = normalizeTasksByStatus(tasksByStatus);
  // console.log('tasksByStatus', tasksByStatus, 'normalized', normalizedTasksByStatus);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { draggableId, source, destination } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;
    const sourceKey = source.droppableId;
    const destKey = destination.droppableId;
    const sourceTasks = Array.from(normalizedTasksByStatus[sourceKey] || []);
    const destTasks = Array.from(normalizedTasksByStatus[destKey] || []);
    const [movedTask] = sourceTasks.splice(source.index, 1);
    if (!movedTask) return;
    movedTask.status = destKey;
    destTasks.splice(destination.index, 0, movedTask);
    setTasksByStatus({
      ...normalizedTasksByStatus,
      [sourceKey]: sourceTasks,
      [destKey]: destTasks,
    });
    await sendApiRequest('put', `/api/task/${draggableId}`, { status: destKey });
    fetchTasks();
  };

  return (
    <div className="flex gap-4 overflow-x-auto p-4" style={{ minHeight: 500 }}>
      <DragDropContext onDragEnd={onDragEnd}>
        {STATUS_MAP.map(({ key, label }) => (
          <TaskColumn
            key={key}
            status={label}
            statusKey={key}
            tasks={normalizedTasksByStatus[key] || []}
            loading={loading}
            fetchTasks={fetchTasks}
            projectId={projectId}
          />
        ))}
      </DragDropContext>
    </div>
  );
};

export default TasksBoard; 