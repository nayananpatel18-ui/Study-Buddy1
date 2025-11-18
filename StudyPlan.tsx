import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import PomodoroTimer from "@/components/PomodoroTimer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Coffee, Brain, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Task {
  name: string;
  subject: string;
  difficulty: string;
  priority: string;
  deadline: string;
}

interface ScheduledTask extends Task {
  startTime: string;
  duration: number;
  aiAdjusted?: boolean;
}

const StudyPlan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);
  const [mood, setMood] = useState<string>("");
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number | null>(null);
  const [showTimer, setShowTimer] = useState(false);

  useEffect(() => {
    const tasksString = localStorage.getItem("studyTasks");
    const userMood = localStorage.getItem("userMood");
    
    if (!tasksString) {
      navigate("/dashboard");
      return;
    }

    const tasks: Task[] = JSON.parse(tasksString);
    setMood(userMood || "neutral");
    
    // Simple AI logic to schedule tasks based on priority, difficulty, and mood
    const scheduled = generateSchedule(tasks, userMood || "neutral");
    setScheduledTasks(scheduled);
  }, [navigate]);

  const generateSchedule = (tasks: Task[], userMood: string): ScheduledTask[] => {
    const schedule: ScheduledTask[] = [];
    let currentTime = 9; // Start at 9 AM
    
    // Sort tasks: high priority first, then by difficulty based on mood
    const sortedTasks = [...tasks].sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority as keyof typeof priorityOrder] - 
                          priorityOrder[a.priority as keyof typeof priorityOrder];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // If tired, schedule easier tasks first
      if (userMood === "tired") {
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - 
               difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      }
      
      return 0;
    });

    sortedTasks.forEach((task, index) => {
      // Calculate duration based on difficulty
      let duration = 45; // Base duration in minutes
      if (task.difficulty === "hard") duration = 90;
      else if (task.difficulty === "easy") duration = 30;
      
      // Adjust duration based on mood
      if (userMood === "tired") {
        duration = Math.round(duration * 0.7); // 30% shorter sessions when tired
      }
      
      const hours = Math.floor(currentTime);
      const minutes = (currentTime % 1) * 60;
      const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      schedule.push({
        ...task,
        startTime,
        duration,
        aiAdjusted: userMood === "tired" && duration < 45,
      });
      
      // Add time for the task
      currentTime += duration / 60;
      
      // Add break after each task (except the last one)
      if (index < sortedTasks.length - 1) {
        const breakDuration = userMood === "tired" ? 20 : 15;
        const breakHours = Math.floor(currentTime);
        const breakMinutes = (currentTime % 1) * 60;
        const breakTime = `${breakHours.toString().padStart(2, '0')}:${breakMinutes.toString().padStart(2, '0')}`;
        
        schedule.push({
          name: "Break Time",
          subject: "Rest",
          difficulty: "easy",
          priority: "high",
          deadline: "",
          startTime: breakTime,
          duration: breakDuration,
        });
        
        currentTime += breakDuration / 60;
      }
    });
    
    return schedule;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive";
      case "medium": return "bg-primary";
      case "low": return "bg-accent";
      default: return "bg-muted";
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case "hard": return <AlertCircle className="w-4 h-4" />;
      case "medium": return <Brain className="w-4 h-4" />;
      case "easy": return <CheckCircle2 className="w-4 h-4" />;
      default: return null;
    }
  };

  const isBreak = (task: ScheduledTask) => task.subject === "Rest";

  const getMotivationalMessage = (mood: string) => {
    const messages = {
      happy: "You're in a great mood! Let's make the most of this positive energy and achieve amazing things today! 🌟",
      neutral: "Consistency is key to success. One step at a time, you're building the future you want. Keep going! 💪",
      tired: "It's okay to feel tired. Remember, even small progress is still progress. Be kind to yourself today. 🌸"
    };
    return messages[mood as keyof typeof messages] || messages.neutral;
  };

  const getNextActivity = () => {
    if (currentTaskIndex !== null && currentTaskIndex < scheduledTasks.length) {
      return scheduledTasks[currentTaskIndex];
    }
    return scheduledTasks.length > 0 ? scheduledTasks[0] : null;
  };

  const handleTimerComplete = () => {
    const nextIndex = (currentTaskIndex ?? -1) + 1;
    if (nextIndex < scheduledTasks.length) {
      setCurrentTaskIndex(nextIndex);
      toast({
        title: "Moving to next activity",
        description: `Starting: ${scheduledTasks[nextIndex].name}`,
      });
    } else {
      setShowTimer(false);
      setCurrentTaskIndex(null);
      toast({
        title: "All activities complete!",
        description: "Great work on completing your study plan!",
      });
    }
  };

  const handleSkipTask = () => {
    handleTimerComplete();
  };

  const startTimer = () => {
    setCurrentTaskIndex(0);
    setShowTimer(true);
  };

  return (
    <div className="min-h-screen gradient-soft">
      <Navigation />
      
      <main className="pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="animate-fade-in flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Your AI-Generated Study Plan</h1>
              <p className="text-muted-foreground">
                Optimized for your current mood: <span className="font-semibold capitalize">{mood}</span>
              </p>
            </div>
            {!showTimer && scheduledTasks.length > 0 && (
              <Button onClick={startTimer} size="lg">
                Start Pomodoro Timer
              </Button>
            )}
          </div>

          {/* Pomodoro Timer */}
          {showTimer && currentTaskIndex !== null && currentTaskIndex < scheduledTasks.length && (
            <div className="animate-fade-in">
              <PomodoroTimer
                taskName={scheduledTasks[currentTaskIndex].name}
                duration={scheduledTasks[currentTaskIndex].duration}
                isBreak={isBreak(scheduledTasks[currentTaskIndex])}
                onComplete={handleTimerComplete}
                onSkip={handleSkipTask}
              />
            </div>
          )}

          {/* Motivational Message */}
          <Card className="glass-card animate-fade-in gradient-primary">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Brain className="w-6 h-6 flex-shrink-0 mt-1 text-primary-foreground" />
                <div>
                  <h3 className="font-semibold mb-1 text-primary-foreground">Stay Motivated!</h3>
                  <p className="text-primary-foreground/90 text-sm">
                    {getMotivationalMessage(mood)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Up Reminder */}
          {getNextActivity() && (
            <Card className="glass-card animate-fade-in border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Next Up: Start at {getNextActivity()?.startTime}
                </CardTitle>
                <CardDescription>
                  {isBreak(getNextActivity()!) 
                    ? "Time to recharge with a break!" 
                    : `Get ready for ${getNextActivity()?.name} - ${getNextActivity()?.subject}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm">
                  <Badge className={isBreak(getNextActivity()!) ? "bg-accent" : getPriorityColor(getNextActivity()!.priority)}>
                    {isBreak(getNextActivity()!) ? "Break" : getNextActivity()?.priority}
                  </Badge>
                  <span className="text-muted-foreground">
                    Duration: {getNextActivity()?.duration} minutes
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Adjustments Notice */}
          {mood === "tired" && (
            <Card className="glass-card animate-fade-in gradient-secondary text-white">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Brain className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">AI Adjusted Your Schedule</h3>
                    <p className="text-white/90 text-sm">
                      Since you're feeling tired, I've shortened your study sessions and added more breaks. 
                      Remember, rest is productive too!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Study Timeline */}
          <div className="space-y-4 animate-fade-in">
            {scheduledTasks.map((task, index) => (
              <Card
                key={index}
                className={`glass-card glass-card-hover ${
                  isBreak(task) ? "border-accent/50" : ""
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {isBreak(task) ? (
                          <Coffee className="w-5 h-5 text-accent" />
                        ) : (
                          getDifficultyIcon(task.difficulty)
                        )}
                        <CardTitle className={isBreak(task) ? "text-accent" : ""}>
                          {task.name}
                        </CardTitle>
                        {task.aiAdjusted && (
                          <Badge variant="secondary" className="ml-2">
                            AI Adjusted
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {task.startTime} ({task.duration} min)
                        </span>
                        {!isBreak(task) && (
                          <>
                            <span>•</span>
                            <span>{task.subject}</span>
                            <span>•</span>
                            <span className="capitalize">{task.difficulty}</span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                    {!isBreak(task) && (
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                {isBreak(task) && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Take a proper break! Stretch, hydrate, or take a short walk.
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Summary Card */}
          <Card className="glass-card animate-fade-in">
            <CardHeader>
              <CardTitle>Plan Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Study Sessions:</span>
                <span className="font-semibold">
                  {scheduledTasks.filter(t => !isBreak(t)).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Breaks:</span>
                <span className="font-semibold">
                  {scheduledTasks.filter(t => isBreak(t)).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Total Time:</span>
                <span className="font-semibold">
                  {Math.round(scheduledTasks.reduce((acc, t) => acc + t.duration, 0) / 60)} hours
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default StudyPlan;
