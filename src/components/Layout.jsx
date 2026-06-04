import { Outlet } from 'react-router-dom';
import GlassNavbar from './GlassNavbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <GlassNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}