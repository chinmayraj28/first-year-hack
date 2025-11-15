'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shader, ChromaFlow, Swirl } from 'shaders/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { MagneticButton } from '@/components/magnetic-button';
import { GrainOverlay } from '@/components/grain-overlay';
import { 
  Shield, 
  FileText, 
  AlertTriangle, 
  User, 
  Calendar, 
  Brain,
  BookOpen,
  Target,
  Calculator,
  PenTool,
  Zap,
  Hand,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
  userId: string;
}

export interface OnboardingData {
  acceptedPrivacy: boolean;
  acceptedTerms: boolean;
  acceptedDisclaimer: boolean;
  childName: string;
  childAge: number;
  childGrade: string;
  concerns: string[];
  notes: string;
}

const CONCERNS_OPTIONS = [
  { id: 'reading', label: 'Reading Difficulty', description: 'Trouble with letters, sounds, or decoding', icon: BookOpen },
  { id: 'attention', label: 'Attention Issues', description: 'Difficulty focusing or staying on task', icon: Target },
  { id: 'math', label: 'Math Struggles', description: 'Challenges with numbers or calculations', icon: Calculator },
  { id: 'writing', label: 'Writing Challenges', description: 'Difficulty with handwriting or spelling', icon: PenTool },
  { id: 'memory', label: 'Memory Concerns', description: 'Trouble remembering instructions or sequences', icon: Brain },
  { id: 'motor', label: 'Motor Skills', description: 'Coordination or fine motor difficulties', icon: Hand },
  { id: 'none', label: 'No Specific Concerns', description: 'General screening for peace of mind', icon: CheckCircle2 },
];

export default function OnboardingFlow({ onComplete, userId }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<OnboardingData>>({
    concerns: [],
  });
  const [isLoaded, setIsLoaded] = useState(false);

  const totalSteps = 6;

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(data as OnboardingData);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleConcern = (concernId: string) => {
    const concerns = data.concerns || [];
    if (concerns.includes(concernId)) {
      setData({ ...data, concerns: concerns.filter((c) => c !== concernId) });
    } else {
      setData({ ...data, concerns: [...concerns, concernId] });
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.acceptedPrivacy;
      case 2:
        return data.acceptedTerms;
      case 3:
        return data.acceptedDisclaimer;
      case 4:
        return data.childName && data.childName.trim().length > 0;
      case 5:
        return data.childAge && data.childAge >= 5 && data.childAge <= 10;
      case 6:
        return data.concerns && data.concerns.length > 0;
      default:
        return true;
    }
  };

  const getStepIcon = () => {
    switch (step) {
      case 1: return Shield;
      case 2: return FileText;
      case 3: return AlertTriangle;
      case 4: return User;
      case 5: return Calendar;
      case 6: return Brain;
      default: return Shield;
    }
  };

  const StepIcon = getStepIcon();

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden p-4 md:p-8">
      <GrainOverlay />
      
      {/* WebGL Background matching login page */}
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Shader className="h-full w-full">
          <Swirl
            colorA="#1275d8"
            colorB="#e19136"
            speed={0.8}
            detail={0.8}
            blend={50}
            coarseX={40}
            coarseY={40}
            mediumX={40}
            mediumY={40}
            fineX={40}
            fineY={40}
          />
          <ChromaFlow
            baseColor="#0066ff"
            upColor="#0066ff"
            downColor="#d1d1d1"
            leftColor="#e19136"
            rightColor="#e19136"
            intensity={0.9}
            radius={1.8}
            momentum={25}
            maskType="alpha"
            opacity={0.97}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-2xl relative z-10 transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-white/90">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-white/70">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-background/30 rounded-full h-2 overflow-hidden backdrop-blur-md">
            <motion.div
              className="bg-gradient-to-r from-primary via-primary/90 to-accent h-2 rounded-full shadow-lg shadow-primary/20"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="border-2 border-border/30 bg-card/80 backdrop-blur-2xl shadow-2xl">
              <CardHeader>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-md border-2 border-primary/40">
                    <StepIcon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white font-light">
                      {step === 1 && 'Privacy Policy'}
                      {step === 2 && 'Terms of Use'}
                      {step === 3 && 'Important Disclaimer'}
                      {step === 4 && "Child's Information"}
                      {step === 5 && 'Age & Grade'}
                      {step === 6 && 'Areas of Concern'}
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      {step === 1 && 'Understanding how we protect your data'}
                      {step === 2 && 'Using SproutSense responsibly'}
                      {step === 3 && 'Understanding the limits of this tool'}
                      {step === 4 && "Let's set up a profile"}
                      {step === 5 && 'Help us personalize the experience'}
                      {step === 6 && 'What would you like to observe?'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Step 1: Privacy Policy */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-5 max-h-64 overflow-y-auto backdrop-blur-sm">
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-primary" />
                        Your Privacy Matters
                      </h4>
                      <ul className="space-y-2.5 text-sm text-white/90">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>All data is stored locally on your device</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>We never collect, transmit, or sell your data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>No tracking cookies or analytics</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Your child's information stays private</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>You can delete all data anytime</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>Authentication is only for your account access</span>
                        </li>
                      </ul>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={data.acceptedPrivacy || false}
                        onChange={(e) => setData({ ...data, acceptedPrivacy: e.target.checked })}
                        className="mt-1 w-5 h-5 rounded border-border/40 bg-background/30 accent-primary"
                      />
                      <span className="text-sm text-white/90 group-hover:text-white transition-colors">
                        I understand and accept the privacy policy. I consent to storing my child's assessment data
                        locally on this device.
                      </span>
                    </label>
                  </div>
                )}

                {/* Step 2: Terms */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="bg-accent/10 border-2 border-accent/30 rounded-xl p-5 max-h-64 overflow-y-auto backdrop-blur-sm">
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-accent" />
                        Terms of Use
                      </h4>
                      <ul className="space-y-2.5 text-sm text-white/90">
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">•</span>
                          <span>This tool is for educational screening only</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">•</span>
                          <span>Free for personal, non-commercial use</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">•</span>
                          <span>Must be used by parents/guardians for their own children</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">•</span>
                          <span>Children should use with parental supervision</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">•</span>
                          <span>Results are observational, not diagnostic</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-accent mt-0.5">•</span>
                          <span>We reserve the right to update the tool</span>
                        </li>
                      </ul>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={data.acceptedTerms || false}
                        onChange={(e) => setData({ ...data, acceptedTerms: e.target.checked })}
                        className="mt-1 w-5 h-5 rounded border-border/40 bg-background/30 accent-primary"
                      />
                      <span className="text-sm text-white/90 group-hover:text-white transition-colors">
                        I agree to use SproutSense according to these terms and conditions.
                      </span>
                    </label>
                  </div>
                )}

                {/* Step 3: Disclaimer */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="bg-destructive/10 border-2 border-destructive/30 rounded-xl p-5 backdrop-blur-sm">
                      <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        Critical Disclaimer
                      </h4>
                      <div className="space-y-3 text-sm text-white/90">
                        <p className="font-medium text-white">
                          This is NOT a medical or diagnostic tool.
                        </p>
                        <p>
                          SproutSense is a screening tool that highlights play patterns which MAY indicate
                          learning differences. It cannot diagnose conditions like dyslexia, ADHD, dyscalculia,
                          or any other learning or developmental disorder.
                        </p>
                        <p className="text-white font-medium">
                          If you have concerns:
                        </p>
                        <ul className="space-y-2 ml-2">
                          <li>Consult with an educational psychologist</li>
                          <li>Speak to your pediatrician</li>
                          <li>Contact your child's school for assessment</li>
                          <li>Seek professional evaluation</li>
                        </ul>
                        <p className="font-medium">
                          Use this tool as a conversation starter, not a diagnosis.
                        </p>
                      </div>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={data.acceptedDisclaimer || false}
                        onChange={(e) => setData({ ...data, acceptedDisclaimer: e.target.checked })}
                        className="mt-1 w-5 h-5 rounded border-border/40 bg-background/30 accent-primary"
                      />
                      <span className="text-sm text-white/90 group-hover:text-white transition-colors">
                        I understand this is not a diagnostic tool and will seek professional help if needed.
                      </span>
                    </label>
                  </div>
                )}

                {/* Step 4: Child's Name */}
                {step === 4 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="childName" className="text-lg text-white/90">
                        What is your child's first name?
                      </Label>
                      <Input
                        id="childName"
                        placeholder="Enter first name"
                        value={data.childName || ''}
                        onChange={(e) => setData({ ...data, childName: e.target.value })}
                        className="text-lg h-12 bg-background/30 border-border/40 text-white placeholder:text-white/50"
                        autoFocus
                      />
                      <p className="text-sm text-white/70">
                        This helps personalize the experience and organize results.
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 5: Age & Grade */}
                {step === 5 && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="childAge" className="text-lg text-white/90">
                        How old is {data.childName}?
                      </Label>
                      <Input
                        id="childAge"
                        type="number"
                        min="5"
                        max="10"
                        placeholder="Age (5-10)"
                        value={data.childAge || ''}
                        onChange={(e) => setData({ ...data, childAge: parseInt(e.target.value) })}
                        className="text-lg h-12 bg-background/30 border-border/40 text-white placeholder:text-white/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="childGrade" className="text-lg text-white/90">
                        What grade? (Optional)
                      </Label>
                      <Input
                        id="childGrade"
                        placeholder="e.g., Kindergarten, 1st Grade, 2nd Grade"
                        value={data.childGrade || ''}
                        onChange={(e) => setData({ ...data, childGrade: e.target.value })}
                        className="text-lg h-12 bg-background/30 border-border/40 text-white placeholder:text-white/50"
                      />
                    </div>
                  </div>
                )}

                {/* Step 6: Concerns */}
                {step === 6 && (
                  <div className="space-y-4">
                    <p className="text-white/70">
                      Select any areas you'd like to observe. This helps us focus on what matters to you.
                    </p>
                    <div className="grid gap-3">
                      {CONCERNS_OPTIONS.map((concern) => (
                        <motion.div
                          key={concern.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card
                            className={`cursor-pointer transition-all border-2 backdrop-blur-sm ${
                              data.concerns?.includes(concern.id)
                                ? 'border-primary/50 bg-primary/20'
                                : 'border-border/30 bg-background/20 hover:border-primary/40 hover:bg-background/30'
                            }`}
                            onClick={() => toggleConcern(concern.id)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-semibold text-white">{concern.label}</div>
                                  <div className="text-sm text-white/70">{concern.description}</div>
                                </div>
                                {data.concerns?.includes(concern.id) && (
                                  <Badge className="bg-primary text-white">
                                    <CheckCircle2 className="h-3 w-3" />
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-4">
                  {step > 1 && (
                    <MagneticButton
                      variant="secondary"
                      onClick={handleBack}
                      className="flex-1"
                    >
                      ← Back
                    </MagneticButton>
                  )}
                  <MagneticButton
                    onClick={handleNext}
                    variant="primary"
                    className={`flex-1 ${!canProceed() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {step === totalSteps ? 'Complete Setup' : 'Continue →'}
                  </MagneticButton>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
