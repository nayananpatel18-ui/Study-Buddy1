import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smile, Meh, Frown, Plus, Sparkles, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Task {
  name: string;
  subject: string;
  difficulty: string;
  priority: string;
  deadline: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [mood, setMood] = useState<string>("neutral");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task>({
    name: "",
    subject: "",
    difficulty: "medium",
    priority: "medium",
    deadline: "",
  });

  // Dummy workload data
  const workloadData = [
    { day: "Mon", hours: 4 },
    { day: "Tue", hours: 6 },
    { day: "Wed", hours: 3 },
    { day: "Thu", hours: 5 },
    { day: "Fri", hours: 4 },
    { day: "Sat", hours: 2 },
    { day: "Sun", hours: 1 },
  ];

  const handleAddTask = () => {
    if (!currentTask.name || !currentTask.subject || !currentTask.deadline) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setTasks([...tasks, currentTask]);
    setCurrentTask({
      name: "",
      subject: "",
      difficulty: "medium",
      priority: "medium",
      deadline: "",
    });
    toast.success("Task added successfully!");
  };

  const generateAISuggestion = () => {
    const taskCount = tasks.length;
    let suggestion = "";

    if (mood === "happy" && taskCount < 5) {
      suggestion = "Great energy! Consider tackling your high-priority tasks first. You're in the perfect mindset for challenging work.";
    } else if (mood === "neutral" && taskCount < 5) {
      suggestion = "Steady pace! Mix challenging and easier tasks. Don't forget to take breaks every 45 minutes.";
    } else if (mood === "tired" || taskCount >= 5) {
      suggestion = "You seem overwhelmed. Let's prioritize and schedule lighter tasks for today. Consider delegating or postponing non-urgent items.";
    } else {
      suggestion = "Balance is key! Schedule your tasks with adequate breaks. Remember, quality over quantity.";
    }

    return suggestion;
  };

  const handleGeneratePlan = () => {
    if (tasks.length === 0) {
      toast.error("Please add at least one task before generating a study plan");
      return;
    }
    
    // Store tasks and mood in localStorage for the study plan page
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
    localStorage.setItem("userMood", mood);
    
    toast.success("Study plan generated!");
    navigate("/study-plan");
  };

  const moodOptions = [
    { value: "happy", icon: Smile, label: "Energetic", color: "text-accent" },
    { value: "neutral", icon: Meh, label: "Neutral", color: "text-primary" },
    { value: "tired", icon: Frown, label: "Tired", color: "text-destructive" },
  ];

  return (
    <div className="min-h-screen gradient-soft">
      <Navigation />
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="animate-fade-in">
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Organize your tasks and let AI help you plan</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Add Task Card */}
            <Card className="glass-card animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New Task
                </CardTitle>
                <CardDescription>Fill in the details of your upcoming task</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="taskName">Task Name *</Label>
                  <Input
                    id="taskName"
                    placeholder="e.g., Complete Chapter 5"
                    value={currentTask.name}
                    onChange={(e) => setCurrentTask({ ...currentTask, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Mathematics"
                    value={currentTask.subject}
                    onChange={(e) => setCurrentTask({ ...currentTask, subject: e.target.value })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty</Label>
                    <Select value={currentTask.difficulty} onValueChange={(val) => setCurrentTask({ ...currentTask, difficulty: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={currentTask.priority} onValueChange={(val) => setCurrentTask({ ...currentTask, priority: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline *</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={currentTask.deadline}
                    onChange={(e) => setCurrentTask({ ...currentTask, deadline: e.target.value })}
                  />
                </div>
                
                <Button onClick={handleAddTask} className="w-full gradient-primary text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
                
                {tasks.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Added Tasks ({tasks.length})</p>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {tasks.map((task, idx) => (
                        <div key={idx} className="text-sm p-2 rounded-lg bg-muted/50">
                          <div className="font-medium">{task.name}</div>
                          <div className="text-muted-foreground text-xs">
                            {task.subject} • {task.priority} priority
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mood & AI Suggestions */}
            <div className="space-y-6">
              <Card className="glass-card animate-fade-in">
                <CardHeader>
                  <CardTitle>How are you feeling?</CardTitle>
                  <CardDescription>Your mood helps us create a better plan</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {moodOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          onClick={() => setMood(option.value)}
                          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                            mood === option.value
                              ? "border-primary bg-primary/10 scale-105"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <Icon className={`w-8 h-8 mx-auto mb-2 ${option.color}`} />
                          <div className="text-xs font-medium">{option.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card animate-fade-in gradient-primary text-white">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    AI Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/90">{generateAISuggestion()}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Workload Summary */}
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Weekly Workload Summary
              </CardTitle>
              <CardDescription>Your estimated study hours this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={workloadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Generate Plan Button */}
          <div className="flex justify-center animate-fade-in">
            <Button
              onClick={handleGeneratePlan}
              size="lg"
              className="gradient-accent text-white text-lg px-8 py-6 hover:scale-105 transition-transform duration-300"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate AI Study Plan
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
