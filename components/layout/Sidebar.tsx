import React from 'react';
import { View } from '../../types';
import { useTheme } from '../../hooks/useTheme';
import { 
    BrainIcon, 
    DashboardIcon, 
    PlayOutlineIcon, 
    ChartIcon, 
    TrophyOutlineIcon, 
    LightbulbIcon,
    SunIcon,
    MoonIcon,
    LogoutIcon
} from '../icons/SidebarIcons';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  onLogout: () => void;
}

const NavItem: React.FC<{
  view: View;
  label: string;
  icon: React.ReactNode;
  activeView: View;
  onClick: (view: View) => void;
}> = ({ view, label, icon, activeView, onClick }) => (
  <li
    onClick={() => onClick(view)}
    className={`flex items-center p-3 my-1 rounded-lg cursor-pointer transition-colors duration-200 ${
      activeView === view
        ? 'bg-primary-light text-primary font-bold dark:bg-primary/20'
        : 'text-secondary hover:bg-gray-200 dark:text-dark-muted dark:hover:bg-gray-700'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onLogout }) => {
  const [theme, toggleTheme] = useTheme();

  return (
    <aside className="w-64 bg-white dark:bg-dark-card shadow-md flex flex-col p-4">
      <div className="flex items-center mb-10 p-3">
        <BrainIcon className="w-8 h-8 text-primary" />
        <h1 className="text-2xl font-bold text-dark dark:text-dark-text ml-2">FocusUp</h1>
      </div>
      
      <nav className="flex-grow">
        <ul>
          <NavItem view="dashboard" label="Dashboard" icon={<DashboardIcon />} activeView={activeView} onClick={setActiveView} />
          <NavItem view="start-focus" label="Mulai Fokus" icon={<PlayOutlineIcon />} activeView={activeView} onClick={setActiveView} />
          <NavItem view="statistics" label="Statistik" icon={<ChartIcon />} activeView={activeView} onClick={setActiveView} />
          <NavItem view="leaderboard" label="Leaderboard" icon={<TrophyOutlineIcon />} activeView={activeView} onClick={setActiveView} />
          <NavItem view="tips-tricks" label="Tips & Trik" icon={<LightbulbIcon />} activeView={activeView} onClick={setActiveView} />
        </ul>
      </nav>

      <div>
        <ul>
            <li 
              onClick={toggleTheme}
              className="flex items-center p-3 my-1 rounded-lg text-secondary hover:bg-gray-200 dark:text-dark-muted dark:hover:bg-gray-700 cursor-pointer">
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                <span className="ml-3">{theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}</span>
            </li>
        </ul>
        <div className="border-t dark:border-gray-700 my-4"></div>
        <button
          onClick={onLogout}
          className="flex items-center w-full p-3 rounded-lg text-danger hover:bg-red-100 dark:hover:bg-danger/10 transition-colors duration-200"
        >
          <LogoutIcon />
          <span className="ml-3 font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;