'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserButton } from '@clerk/nextjs';
import { Shader, ChromaFlow, Swirl } from 'shaders/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChildProfile } from '@/types/profile';
// Note: This component is not currently used. If needed, update to use Convex hooks.
import { GrainOverlay } from '@/components/grain-overlay';
import { MagneticButton } from '@/components/magnetic-button';
import { 
  Activity,
  Plus,
  PlayCircle,
  TrendingUp,
  Calendar,
  Users,
  History as HistoryIcon,
  Sparkles
} from 'lucide-react';

interface ProfessionalDashboardProps {
  userId: string;
  children: ChildProfile[];
  onSelectChild: (childId: string) => void;
  onAddChild: () => void;
}

export default function ProfessionalDashboard({
  userId,
  children,
  onSelectChild,
  onAddChild,
}: ProfessionalDashboardProps) {
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const [selectedView, setSelectedView] = useState<'overview' | 'children' | 'history'>('overview');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // TODO: Update to use Convex hooks if this component is needed
    // const reports = useGetAllReports();
    setTestHistory([]);
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'green':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'yellow':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'red':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getOverallSignal = (test: any) => {
    if (!test.domainResults) return 'green';
    const signals = test.domainResults.map((r: any) => r.signal);
    if (signals.includes('red')) return 'red';
    if (signals.includes('yellow')) return 'yellow';
    return 'green';
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      <GrainOverlay />

      {/* Animated Background */}
      <div className="fixed inset-0 z-0 opacity-40">
        <Shader className="h-full w-full">
          <Swirl
            colorA="#1275d8"
            colorB="#e19136"
            speed={0.6}
            detail={0.7}
            blend={60}
            coarseX={30}
            coarseY={30}
            mediumX={30}
            mediumY={30}
            fineX={30}
            fineY={30}
          />
          <ChromaFlow
            baseColor="#0066ff"
            upColor="#0066ff"
            downColor="#d1d1d1"
            leftColor="#e19136"
            rightColor="#e19136"
            intensity={0.7}
            radius={1.5}
            momentum={20}
            maskType="alpha"
            opacity={0.95}
          />
        </Shader>
      </div>

      {/* Header */}
      <nav className={`fixed left-0 right-0 top-0 z-50 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-xl border border-primary/30">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">SproutSense</h1>
                <p className="text-xs text-muted-foreground">Early Learning Assessment</p>
              </div>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className={`relative z-10 pt-32 pb-16 transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="mx-auto max-w-7xl px-6">
          {/* View Switcher */}
          <div className="mb-8 flex items-center gap-4">
            <MagneticButton
              variant={selectedView === 'overview' ? 'primary' : 'secondary'}
              size="default"
              onClick={() => setSelectedView('overview')}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Overview
            </MagneticButton>
            <MagneticButton
              variant={selectedView === 'children' ? 'primary' : 'secondary'}
              size="default"
              onClick={() => setSelectedView('children')}
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              Children
            </MagneticButton>
            <MagneticButton
              variant={selectedView === 'history' ? 'primary' : 'secondary'}
              size="default"
              onClick={() => setSelectedView('history')}
              className="gap-2"
            >
              <HistoryIcon className="h-4 w-4" />
              History
            </MagneticButton>
          </div>

          {/* Overview View */}
          {selectedView === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Stats */}
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total Children
                    </CardTitle>
                    <Users className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-foreground">{children.length}</div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Tests Completed
                    </CardTitle>
                    <TrendingUp className="h-5 w-5 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-foreground">{testHistory.length}</div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Latest Assessment
                    </CardTitle>
                    <Calendar className="h-5 w-5 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-semibold text-foreground">
                      {testHistory.length > 0 ? formatDate(testHistory[0].timestamp) : 'No tests yet'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-foreground">Quick Actions</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Start a new assessment or manage profiles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {children.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No children added yet</h3>
                      <p className="text-sm text-muted-foreground mb-6">Add a child profile to begin assessments</p>
                      <MagneticButton variant="primary" onClick={onAddChild}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Child
                      </MagneticButton>
                    </div>
                  ) : (
                    <>
                      {children.map((child) => (
                        <div
                          key={child.id}
                          className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 p-4 backdrop-blur-sm"
                        >
                          <div>
                            <h4 className="font-semibold text-foreground">{child.name}</h4>
                            <p className="text-sm text-muted-foreground">Age {child.age}</p>
                          </div>
                          <MagneticButton
                            variant="primary"
                            size="default"
                            onClick={() => onSelectChild(child.id)}
                          >
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Start Assessment
                          </MagneticButton>
                        </div>
                      ))}
                      <MagneticButton variant="secondary" onClick={onAddChild} className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Another Child
                      </MagneticButton>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              {testHistory.length > 0 && (
                <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-foreground">Recent Activity</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Latest assessment results
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {testHistory.slice(0, 3).map((test, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/20 p-4 backdrop-blur-sm"
                        >
                          <div>
                            <h4 className="font-semibold text-foreground">{test.childName}</h4>
                            <p className="text-sm text-muted-foreground">{formatDate(test.timestamp)}</p>
                          </div>
                          <Badge className={`${getSignalColor(getOverallSignal(test))} border`}>
                            {getOverallSignal(test) === 'green' && 'Typical'}
                            {getOverallSignal(test) === 'yellow' && 'Monitor'}
                            {getOverallSignal(test) === 'red' && 'Attention'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Children View */}
          {selectedView === 'children' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {children.length === 0 ? (
                <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Users className="h-20 w-20 text-muted-foreground/50 mb-6" />
                    <h3 className="text-2xl font-semibold text-foreground mb-2">No children added yet</h3>
                    <p className="text-muted-foreground mb-8 text-center max-w-md">
                      Add a child profile to start tracking their learning journey
                    </p>
                    <MagneticButton variant="primary" size="lg" onClick={onAddChild}>
                      <Plus className="mr-2 h-5 w-5" />
                      Add Your First Child
                    </MagneticButton>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {children.map((child) => {
                    const childTests = testHistory.filter((t) => t.childId === child.id);
                    const latestTest = childTests[0];
                    
                    return (
                      <Card key={child.id} className="border-border/50 bg-card/50 backdrop-blur-xl hover:border-primary/50 transition-all">
                        <CardHeader>
                          <CardTitle className="text-xl text-foreground">{child.name}</CardTitle>
                          <CardDescription className="text-muted-foreground">
                            Age {child.age}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Tests Completed</span>
                            <span className="font-semibold text-foreground">{childTests.length}</span>
                          </div>
                          {latestTest && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Latest Result</span>
                              <Badge className={`${getSignalColor(getOverallSignal(latestTest))} border text-xs`}>
                                {getOverallSignal(latestTest) === 'green' && 'Typical'}
                                {getOverallSignal(latestTest) === 'yellow' && 'Monitor'}
                                {getOverallSignal(latestTest) === 'red' && 'Attention'}
                              </Badge>
                            </div>
                          )}
                          <MagneticButton
                            variant="primary"
                            onClick={() => onSelectChild(child.id)}
                            className="w-full mt-4"
                          >
                            <PlayCircle className="mr-2 h-4 w-4" />
                            Start Assessment
                          </MagneticButton>
                        </CardContent>
                      </Card>
                    );
                  })}
                  
                  <Card className="border-border/50 bg-card/50 backdrop-blur-xl border-dashed hover:border-primary/50 transition-all">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">Add Another Child</h3>
                      <p className="text-sm text-muted-foreground mb-6 text-center">
                        Track multiple children
                      </p>
                      <MagneticButton variant="secondary" onClick={onAddChild}>
                        Add Child
                      </MagneticButton>
                    </CardContent>
                  </Card>
                </div>
              )}
            </motion.div>
          )}

          {/* History View */}
          {selectedView === 'history' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {testHistory.length === 0 ? (
                <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <HistoryIcon className="h-20 w-20 text-muted-foreground/50 mb-6" />
                    <h3 className="text-2xl font-semibold text-foreground mb-2">No test history</h3>
                    <p className="text-muted-foreground mb-8 text-center max-w-md">
                      Complete an assessment to see results here
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {testHistory.map((test, index) => (
                    <Card key={index} className="border-border/50 bg-card/50 backdrop-blur-xl">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg text-foreground">{test.childName}</CardTitle>
                            <CardDescription className="text-muted-foreground">
                              {new Date(test.timestamp).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </CardDescription>
                          </div>
                          <Badge className={`${getSignalColor(getOverallSignal(test))} border`}>
                            {getOverallSignal(test) === 'green' && 'Typical Range'}
                            {getOverallSignal(test) === 'yellow' && 'Monitor'}
                            {getOverallSignal(test) === 'red' && 'Needs Attention'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4 md:grid-cols-2">
                          {test.domainResults?.map((result: any, idx: number) => (
                            <div
                              key={idx}
                              className="rounded-xl border border-border/50 bg-muted/20 p-4 backdrop-blur-sm"
                            >
                              <div className="flex justify-between items-center mb-3">
                                <span className="font-medium text-foreground">{result.domain}</span>
                                <Badge className={`${getSignalColor(result.signal)} border text-xs`}>
                                  {result.signal === 'green' && 'Typical'}
                                  {result.signal === 'yellow' && 'Monitor'}
                                  {result.signal === 'red' && 'Attention'}
                                </Badge>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Accuracy:</span>
                                  <span className="text-foreground font-medium">
                                    {(result.metrics.accuracy * 100).toFixed(0)}%
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Avg Response:</span>
                                  <span className="text-foreground font-medium">
                                    {result.metrics.avgReactionTime.toFixed(0)}ms
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}
