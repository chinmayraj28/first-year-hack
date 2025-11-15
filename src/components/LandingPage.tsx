'use client';

import { Shader, ChromaFlow, Swirl } from 'shaders/react';
import { MagneticButton } from './magnetic-button';
import { GrainOverlay } from './grain-overlay';
import { Brain, Activity, TrendingUp, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-background text-white overflow-hidden">
      {/* Background Shader - matching login page */}
      <div className="fixed inset-0 z-0">
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

      <GrainOverlay />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <span className="text-2xl font-light tracking-tight">SproutSense</span>
        </div>
        <MagneticButton
          variant="ghost"
          onClick={() => router.push('/sign-in')}
        >
          Sign In
        </MagneticButton>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex min-h-[calc(100vh-88px)] flex-col items-center justify-center px-6 text-center md:px-12">
        <div className="max-w-5xl space-y-8">
          <h1 className="text-5xl font-light tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Empowering children through{' '}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              early detection
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-lg font-light text-white/70 md:text-xl">
            SproutSense uses evidence-based assessments to identify early signs of neurodevelopmental conditions, 
            helping families access support sooner.
          </p>

          <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row sm:justify-center">
            <MagneticButton
              size="lg"
              onClick={() => router.push('/sign-up')}
            >
              Get Started
            </MagneticButton>
            <MagneticButton
              size="lg"
              variant="secondary"
              onClick={() => {
                document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Learn More
            </MagneticButton>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-8 w-5 rounded-full border-2 border-white/30">
            <div className="mx-auto mt-2 h-2 w-1 rounded-full bg-white/50" />
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-16 text-center text-4xl font-light tracking-tight md:text-5xl">
            Why SproutSense?
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-white/10">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary ring-2 ring-primary/40">
                <Brain className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-xl font-medium">Evidence-Based</h3>
              <p className="text-sm font-light text-white/70">
                Assessments grounded in clinical research and validated screening tools
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-white/10">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 text-accent ring-2 ring-accent/40">
                <Activity className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-xl font-medium">Interactive Games</h3>
              <p className="text-sm font-light text-white/70">
                Child-friendly assessments disguised as engaging games to reduce anxiety
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-white/10">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/20 text-primary ring-2 ring-primary/40">
                <TrendingUp className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-xl font-medium">Track Progress</h3>
              <p className="text-sm font-light text-white/70">
                Monitor development over time with comprehensive reports and insights
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-white/10">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 text-accent ring-2 ring-accent/40">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="mb-2 text-xl font-medium">Privacy First</h3>
              <p className="text-sm font-light text-white/70">
                Your data is encrypted and protected with industry-leading security
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-4xl font-light tracking-tight md:text-5xl">
            Start your journey today
          </h2>
          <p className="mb-8 text-lg font-light text-white/70">
            Join thousands of families who trust SproutSense for early detection and support.
          </p>
          <MagneticButton
            size="lg"
            onClick={() => router.push('/sign-up')}
          >
            Create Free Account
          </MagneticButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 px-6 py-8 text-center text-sm text-white/50 md:px-12">
        <p>© 2024 SproutSense. All rights reserved.</p>
      </footer>
    </div>
  );
}
