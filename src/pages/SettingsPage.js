import { useTheme, useWeather } from '../contexts';
import { MainLayout } from '../components/layout';
import { ThemeToggle, ToggleUnit } from '../components/ui';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const { unit, toggleUnit } = useWeather();

  return (
    <MainLayout>
      <h2>Settings</h2>
      <div className="settings-grid">
        <div className="setting-item">
          <h3>Theme</h3>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
        <div className="setting-item">
          <h3>Units</h3>
          <ToggleUnit unit={unit} toggleUnit={toggleUnit} />
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;