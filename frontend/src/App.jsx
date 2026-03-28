import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { useTasks } from './hooks/useTasks';
import { LoginPage } from './pages/LoginPage';
import PerformanceTrackerApp from './components/PerformanceTracker';

export default function App() {
  const { isAuthenticated, logout } = useAuth();
  const { tasks, fetchTasks, createTask, updateTask, deleteTask } = useTasks();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
    setLoading(false);
  }, [isAuthenticated, fetchTasks]);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#F5F5F2',
      }}>
        <div style={{ fontSize: '18px', color: '#7A7A7A' }}>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => window.location.reload()} />;
  }

  return (
    <PerformanceTrackerApp
      tasks={tasks}
      onSaveTask={async (task) => {
        if (task.id && tasks.find(t => t.id === task.id)) {
          await updateTask(task.id, task);
        } else {
          await createTask(task);
        }
      }}
      onDeleteTask={deleteTask}
      onLogout={handleLogout}
    />
  );
}
