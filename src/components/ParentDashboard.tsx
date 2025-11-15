'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChildProfile } from '@/types/profile';

interface ParentDashboardProps {
  children: ChildProfile[];
  onSelectChild: (childId: string) => void;
  onAddChild: () => void;
}

export default function ParentDashboard({ children, onSelectChild, onAddChild }: ParentDashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🌱</div>
          <h1 className="text-5xl font-bold text-green-600 mb-2">Parent Dashboard</h1>
          <p className="text-xl text-gray-600">
            Manage your children's learning journey
          </p>
        </div>

        {/* Children Grid */}
        {children.length === 0 ? (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-center py-16"
          >
            <div className="text-8xl mb-6">👶</div>
            <h2 className="text-3xl font-bold text-gray-700 mb-4">
              Welcome to SproutSense!
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Get started by adding your first child's profile. It only takes a minute!
            </p>
            <Button
              onClick={onAddChild}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-6 text-xl rounded-full"
            >
              + Add Your First Child
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {children.map((child, index) => (
                <motion.div
                  key={child.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all cursor-pointer h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-4xl mb-2">👦👧</div>
                          <CardTitle className="text-2xl">{child.name}</CardTitle>
                          <CardDescription>
                            Age {child.age} {child.grade && `• ${child.grade}`}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {child.concerns && child.concerns.length > 0 && (
                        <div>
                          <div className="text-sm font-medium text-gray-600 mb-2">
                            Observing:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {child.concerns.slice(0, 3).map((concern) => (
                              <Badge key={concern} variant="outline" className="text-xs">
                                {concern}
                              </Badge>
                            ))}
                            {child.concerns.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{child.concerns.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <Button
                        onClick={() => onSelectChild(child.id)}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        Start Assessment
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              {/* Add New Child Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: children.length * 0.1 }}
              >
                <Card
                  className="border-2 border-dashed border-gray-300 hover:border-green-400 transition-all cursor-pointer h-full flex items-center justify-center"
                  onClick={onAddChild}
                >
                  <CardContent className="text-center py-12">
                    <div className="text-6xl mb-4">➕</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      Add Another Child
                    </h3>
                    <p className="text-sm text-gray-500">
                      Track multiple children's progress
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="border-2 border-blue-200 bg-blue-50/50">
            <CardContent className="pt-6">
              <div className="text-4xl mb-3">🔒</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">100% Private</h3>
              <p className="text-sm text-gray-600">
                All data stored locally on your device. We never collect or share information.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-green-50/50">
            <CardContent className="pt-6">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Quick & Fun</h3>
              <p className="text-sm text-gray-600">
                Each assessment takes just 2-3 minutes and feels like playing games.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50/50">
            <CardContent className="pt-6">
              <div className="text-4xl mb-3">📊</div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Track Progress</h3>
              <p className="text-sm text-gray-600">
                See patterns over time and share results with professionals.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
