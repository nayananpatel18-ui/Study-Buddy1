import { Link, useLocation } from "react-router-dom";
import { Brain, LayoutDashboard, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="glass-card fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 rounded-lg gradient-primary">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Study Buddy
          </span>
        </Link>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            asChild
            className="transition-all duration-300"
          >
            <Link to="/">Home</Link>
          </Button>
          <Button
            variant={isActive("/dashboard") ? "default" : "ghost"}
            asChild
            className="transition-all duration-300"
          >
            <Link to="/dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          </Button>
          <Button
            variant={isActive("/study-plan") ? "default" : "ghost"}
            asChild
            className="transition-all duration-300"
          >
            <Link to="/study-plan" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Study Plan
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
