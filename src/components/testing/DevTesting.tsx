"use client";

import { useState } from "react";
import { testRunner } from "@/lib/testUtils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Play, CheckCircle, XCircle, AlertCircle } from "lucide-react";

/**
 * Development Testing Component
 * Interface for running manual tests during development
 */
export function DevTesting() {
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());
  const [testResults, setTestResults] = useState<Map<string, "pass" | "fail">>(
    new Map()
  );

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const scenarios = testRunner.getScenarios();
  const categories = [...new Set(scenarios.map((s) => s.category))];

  const runTest = async (scenarioName: string) => {
    setRunningTests((prev) => new Set([...prev, scenarioName]));
    setTestResults((prev) => new Map(prev).set(scenarioName, "pass")); // Optimistic

    try {
      const scenario = scenarios.find((s) => s.name === scenarioName);
      if (scenario) {
        await scenario.execute();
        setTestResults((prev) => new Map(prev).set(scenarioName, "pass"));
      }
    } catch (error) {
      console.error(`Test failed: ${scenarioName}`, error);
      setTestResults((prev) => new Map(prev).set(scenarioName, "fail"));
    } finally {
      setRunningTests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(scenarioName);
        return newSet;
      });
    }
  };

  const runCategory = async (category: string) => {
    const categoryScenarios = scenarios.filter((s) => s.category === category);
    for (const scenario of categoryScenarios) {
      await runTest(scenario.name);
    }
  };

  const getStatusIcon = (scenarioName: string) => {
    if (runningTests.has(scenarioName)) {
      return <AlertCircle className="h-4 w-4 text-yellow-500 animate-spin" />;
    }

    const result = testResults.get(scenarioName);
    if (result === "pass") {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (result === "fail") {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }

    return null;
  };

  return (
    <Card className="fixed top-4 left-4 z-50 w-80 max-h-96 overflow-y-auto">
      <div className="p-4">
        <h3 className="font-semibold mb-4">Development Testing</h3>

        {categories.map((category) => (
          <div key={category} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="capitalize">
                {category}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => runCategory(category)}
                className="text-xs"
              >
                Run All
              </Button>
            </div>

            <div className="space-y-1">
              {scenarios
                .filter((s) => s.category === category)
                .map((scenario) => (
                  <div
                    key={scenario.name}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(scenario.name)}
                      <span className="font-medium">{scenario.name}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => runTest(scenario.name)}
                      disabled={runningTests.has(scenario.name)}
                      className="p-1"
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
