import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, SkipForward, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PomodoroTimerProps {
  taskName: string;
  duration: number; // in minutes
  isBreak: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

const PomodoroTimer = ({ taskName, duration, isBreak, onComplete, onSkip }: PomodoroTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(duration * 60); // Convert to seconds
  const [isRunning, setIsRunning] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const { toast } = useToast();

  const totalSeconds = duration * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  useEffect(() => {
    setTimeLeft(duration * 60);
    setIsRunning(false);
    setHasStarted(false);
  }, [duration, taskName]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          playNotificationSound();
          toast({
            title: isBreak ? "Break Complete!" : "Session Complete!",
            description: isBreak 
              ? "Time to get back to studying!" 
              : "Great work! Time for a break.",
          });
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete, isBreak, toast]);

  const playNotificationSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);

    // Play three beeps
    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 800;
      osc2.type = "sine";
      gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.5);
    }, 200);

    setTimeout(() => {
      const osc3 = audioContext.createOscillator();
      const gain3 = audioContext.createGain();
      osc3.connect(gain3);
      gain3.connect(audioContext.destination);
      osc3.frequency.value = 1000;
      osc3.type = "sine";
      gain3.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      osc3.start(audioContext.currentTime);
      osc3.stop(audioContext.currentTime + 0.5);
    }, 400);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
    if (!hasStarted) setHasStarted(true);
  };

  return (
    <Card className={`glass-card ${isBreak ? "border-accent" : "border-primary"}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className={`w-5 h-5 ${isBreak ? "text-accent" : "text-primary"}`} />
          {isBreak ? "Break Time" : "Focus Session"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-lg mb-2">{taskName}</h3>
          <p className="text-muted-foreground text-sm">
            {duration} minute {isBreak ? "break" : "session"}
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-center">
            <span className={`text-5xl font-bold ${isBreak ? "text-accent" : "text-primary"}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleStartPause}
            className="flex-1"
            variant={isRunning ? "secondary" : "default"}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                {hasStarted ? "Resume" : "Start"}
              </>
            )}
          </Button>
          <Button onClick={onSkip} variant="outline">
            <SkipForward className="w-4 h-4 mr-2" />
            Skip
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PomodoroTimer;
