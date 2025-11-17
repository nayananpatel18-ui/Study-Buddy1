import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Heart, Sparkles, Clock, TrendingUp, Coffee } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Planning",
      description: "Smart algorithms analyze your workload and mood to create personalized study schedules.",
      color: "text-primary",
    },
    {
      icon: Heart,
      title: "Burnout Prevention",
      description: "Intelligent break scheduling and workload management keep you healthy and productive.",
      color: "text-destructive",
    },
    {
      icon: TrendingUp,
      title: "Adaptive Learning",
      description: "The system learns from your patterns and adjusts recommendations over time.",
      color: "text-accent",
    },
    {
      icon: Clock,
      title: "Time Management",
      description: "Optimize your study sessions with data-driven time allocation strategies.",
      color: "text-secondary",
    },
    {
      icon: Coffee,
      title: "Smart Breaks",
      description: "Scientifically-timed breaks to maintain focus and prevent mental fatigue.",
      color: "text-accent",
    },
    {
      icon: Sparkles,
      title: "Mood-Based Scheduling",
      description: "Tasks are arranged based on your current energy levels and mental state.",
      color: "text-primary",
    },
  ];

  return (
    <div className="min-h-screen gradient-soft">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-block p-3 rounded-full gradient-primary mb-4 animate-float">
            <Brain className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Study Smart,
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Not Stressed
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Your AI-powered study companion that prevents burnout through intelligent planning and personalized scheduling.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="gradient-primary text-white text-lg px-8 py-6 hover:scale-105 transition-transform duration-300"
            >
              <Link to="/dashboard">
                Try Demo
                <Sparkles className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Card className="glass-card glass-card-hover animate-fade-in">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl mb-2">The Problem</CardTitle>
              <CardDescription className="text-lg">
                Why students struggle with burnout
              </CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-destructive">73%</div>
                <p className="text-sm text-muted-foreground">
                  of students report experiencing academic burnout
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-primary">8+</div>
                <p className="text-sm text-muted-foreground">
                  hours of daily study without proper breaks
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold text-accent">45%</div>
                <p className="text-sm text-muted-foreground">
                  lower productivity due to poor planning
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent to-primary/5">
        <div className="max-w-6xl mx-auto text-center space-y-12 animate-fade-in">
          <div>
            <h2 className="text-4xl font-bold mb-4">Why It Matters</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Academic success shouldn't come at the cost of your mental health. 
              Smart planning means better grades AND better wellbeing.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <Card className="glass-card glass-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-destructive" />
                  Mental Wellness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Prevent burnout before it happens. Our AI ensures you maintain a healthy 
                  balance between productivity and rest, keeping stress levels in check.
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card glass-card-hover">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-accent" />
                  Better Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Studies show that proper rest and strategic planning lead to 40% better 
                  retention and understanding. Work smarter, not harder.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto space-y-12 animate-fade-in">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to study effectively and stay healthy
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="glass-card glass-card-hover"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card gradient-primary text-white animate-fade-in">
            <CardContent className="text-center py-12 space-y-6">
              <h2 className="text-4xl font-bold">Ready to Transform Your Study Life?</h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join thousands of students who've ditched burnout and embraced smarter studying.
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6 hover:scale-105 transition-transform duration-300"
              >
                <Link to="/dashboard">
                  Get Started Free
                  <Sparkles className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
