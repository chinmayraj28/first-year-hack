import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            Next.js + Tailwind + shadcn/ui
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Your modern web development stack is ready!
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary">Next.js 15</Badge>
            <Badge variant="secondary">Tailwind CSS</Badge>
            <Badge variant="secondary">shadcn/ui</Badge>
            <Badge variant="secondary">TypeScript</Badge>
          </div>
        </div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1 */}
          <Card>
            <CardHeader>
              <CardTitle>Component Demo</CardTitle>
              <CardDescription>
                Beautiful UI components built with Radix UI and Tailwind CSS
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Enter your email" type="email" />
              </div>
              <div className="flex gap-2">
                <Button>Primary Button</Button>
                <Button variant="outline">Secondary</Button>
              </div>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>
                Everything you need to build modern web applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Badge variant="default" className="w-2 h-2 p-0"></Badge>
                  <span>Server-side rendering with Next.js</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="default" className="w-2 h-2 p-0"></Badge>
                  <span>Utility-first CSS with Tailwind</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="default" className="w-2 h-2 p-0"></Badge>
                  <span>Accessible components with shadcn/ui</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="default" className="w-2 h-2 p-0"></Badge>
                  <span>TypeScript for type safety</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card>
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Next steps to build your application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="default">
                Add More Components
              </Button>
              <Button className="w-full" variant="outline">
                Read Documentation
              </Button>
            </CardContent>
          </Card>

          {/* Card 4 */}
          <Card>
            <CardHeader>
              <CardTitle>Dark Mode Ready</CardTitle>
              <CardDescription>
                Built-in support for light and dark themes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Toggle between light and dark modes using your system preferences.
                All components are designed to work seamlessly in both themes.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center pt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ready to build something amazing? Start editing{" "}
            <code className="bg-gray-200 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">
              src/app/page.tsx
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
