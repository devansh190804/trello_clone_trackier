import TasksBoard from '../components/tasks/TasksBoard';
import { useParams } from 'react-router-dom';

const Tasks = () => {
  const { projectId } = useParams();
  return <TasksBoard projectId={projectId} />;
};

export default Tasks; 