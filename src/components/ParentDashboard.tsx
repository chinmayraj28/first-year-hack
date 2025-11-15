'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserButton } from '@clerk/nextjs';
import { Shader, ChromaFlow, Swirl } from 'shaders/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GrainOverlay } from '@/components/grain-overlay';
import { MagneticButton } from '@/components/magnetic-button';
import { ChildProfile, ParentProfile } from '@/types/profile';
// Note: This component is not currently used. If needed, update to use Convex hooks.
import { 
  Activity,
  User,
  FileText,
  Calendar,
  School,
  TrendingUp
} from 'lucide-react';

interface ParentDashboardProps {
  userId: string;
  parentProfile: ParentProfile;
  onSelectChild: (childId: string) => void;
  onRefresh: () => void;
}

export default function ParentDashboard({ 
  userId, 
  parentProfile, 
  onSelectChild,
  onRefresh 
}: ParentDashboardProps) {
  const [testHistory, setTestHistory] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const children = parentProfile.children || [];

  useEffect(() => {
    // TODO: Update to use Convex hooks if this component is needed
    // const reports = useGetReportsForChildren(childrenIds);
    setTestHistory([]);
    setTimeout(() => setIsLoaded(true), 300);
  }, [children]);

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

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getChildReports = (childId: string) => {
    return testHistory.filter((result: any) => 
      result.childId === childId || 
      children.find(c => c.id === childId)?.name === result.childName
    );
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      <GrainOverlay />

      {/* Animated Background */}
      <div className={`fixed inset-0 z-0 transition-opacity duration-700 ${
        isLoaded ? 'opacity-40' : 'opacity-0'
      }`}>
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
      <nav className={`fixed left-0 right-0 top-0 z-50 transition-opacity duration-700 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-xl border border-primary/30">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">SproutSense</h1>
                <p className="text-xs text-muted-foreground">Parent Dashboard</p>
              </div>
            </div>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className={`relative z-10 pt-32 pb-16 transition-opacity duration-700 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="mx-auto max-w-7xl px-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-4xl font-light text-white mb-2">
              Parent Dashboard
            </h2>
            <p className="text-white/70">
              View your child's assessment reports from their classroom
            </p>
            {parentProfile.classroomCode && (
              <div className="mt-4">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <School className="h-3 w-3 mr-1" />
                  Classroom: {parentProfile.classroomCode}
                </Badge>
              </div>
            )}
          </div>

          {/* Children Grid */}
          {children.length === 0 ? (
            <Card className="border-2 border-border/30 bg-card/80 backdrop-blur-2xl">
              <CardContent className="py-12 text-center">
                <User className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Children Added</h3>
                <p className="text-white/70">
                  Your child's teacher will add them to the classroom
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {children.map((child, index) => {
                const childReports = getChildReports(child.id);
                return (
                  <motion.div
                    key={child.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="border-2 border-border/30 bg-card/80 backdrop-blur-2xl">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-white text-2xl">{child.name}</CardTitle>
                            <CardDescription className="text-white/70">
                              Age {child.age} {child.grade && `• ${child.grade}`}
                            </CardDescription>
                          </div>
                          {child.classroomCode && (
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                              {child.classroomCode}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {childReports.length === 0 ? (
                          <div className="py-8 text-center">
                            <FileText className="h-12 w-12 text-primary/50 mx-auto mb-3" />
                            <p className="text-white/70">
                              No assessment reports available yet
                            </p>
                            <p className="text-sm text-white/60 mt-1">
                              Reports will appear here once your child's teacher uploads them
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-white mb-4">
                              Assessment Reports ({childReports.length})
                            </h4>
                            {childReports.map((report, reportIndex) => (
                              <div
                                key={report.id || reportIndex}
                                className="p-4 bg-background/30 rounded-lg border border-border/40"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-white/70" />
                                    <span className="text-sm text-white/70">
                                      {formatDate(report.timestamp)}
                                    </span>
                                  </div>
                                  {report.overallSignal && (
                                    <Badge className={getSignalColor(report.overallSignal)}>
                                      {report.overallSignal.toUpperCase()}
                                    </Badge>
                                  )}
                                </div>
                                {report.domainResults && report.domainResults.length > 0 && (
                                  <div className="space-y-2">
                                    {report.domainResults.map((domain: any, idx: number) => (
                                      <div
                                        key={idx}
                                        className="flex items-center justify-between p-2 bg-background/20 rounded"
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className="text-lg">{domain.emoji}</span>
                                          <span className="text-sm text-white/90">{domain.domain}</span>
                                        </div>
                                        <Badge className={getSignalColor(domain.signal)}>
                                          {domain.signal}
                                        </Badge>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
