interface TestScenario {
  name: string;
  description: string;
  execute: () => Promise<void> | void;
  category: 'email' | 'realtime' | 'performance' | 'error' | 'offline';
}

class TestRunner {
  private scenarios: TestScenario[] = [];

  /**
   * Register a test scenario
   */
  addScenario(scenario: TestScenario) {
    this.scenarios.push(scenario);
  }

  /**
   * Run all scenarios for a category
   */
  async runCategory(category: string) {
    const categoryScenarios = this.scenarios.filter(s => s.category === category);
    console.log(`Running ${categoryScenarios.length} scenarios for category: ${category}`);

    for (const scenario of categoryScenarios) {
      try {
        console.log(`✓ Running: ${scenario.name}`);
        await scenario.execute();
        console.log(`✅ Passed: ${scenario.name}`);
      } catch (error) {
        console.error(`❌ Failed: ${scenario.name}`, error);
      }
    }
  }

  /**
   * Get all scenarios
   */
  getScenarios() {
    return this.scenarios;
  }
}

// Create test runner instance
export const testRunner = new TestRunner();

// =============================================================================
// EMAIL TESTING SCENARIOS
// =============================================================================

testRunner.addScenario({
  name: 'Test Welcome Email',
  description: 'Simulate sending welcome email to new user',
  category: 'email',
  execute: async () => {
    const { emailService } = await import('@/lib/email');
    await emailService.sendWelcomeEmail({
      name: 'Test User',
      email: 'test@example.com',
    });
  },
});

testRunner.addScenario({
  name: 'Test Order Confirmation Email',
  description: 'Simulate order confirmation email',
  category: 'email',
  execute: async () => {
    const { emailService } = await import('@/lib/email');
    const mockOrder = {
      order_number: 'ORD-TEST-001',
      total_amount: 15.50,
      order_type: 'takeaway',
      order_items: [
        { quantity: 2, menu_item: { name: 'Cappuccino' }, unit_price: 4.50 },
        { quantity: 1, menu_item: { name: 'Croissant' }, unit_price: 3.25 },
      ],
      user: { name: 'Test User', email: 'test@example.com' },
    };
    await emailService.sendOrderConfirmation(mockOrder);
  },
});

// =============================================================================
// REAL-TIME TESTING SCENARIOS
// =============================================================================

testRunner.addScenario({
  name: 'Test Real-time Connection',
  description: 'Test WebSocket connection and reconnection',
  category: 'realtime',
  execute: async () => {
    const { realtimeManager } = await import('@/lib/realtime');
    const status = realtimeManager.getConnectionStatus();
    console.log('Connection Status:', status);
    
    if (status.channelCount === 0) {
      throw new Error('No real-time channels active');
    }
  },
});

testRunner.addScenario({
  name: 'Simulate Network Disconnection',
  description: 'Test offline/online behavior',
  category: 'realtime',
  execute: () => {
    // Simulate going offline
    Object.defineProperty(navigator, 'onLine', {
      writable: true,
      value: false,
    });
    
    window.dispatchEvent(new Event('offline'));
    
    setTimeout(() => {
      // Simulate coming back online
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: true,
      });
      window.dispatchEvent(new Event('online'));
    }, 2000);
  },
});

// =============================================================================
// PERFORMANCE TESTING SCENARIOS
// =============================================================================

testRunner.addScenario({
  name: 'Test Large Dataset Rendering',
  description: 'Test performance with large number of orders',
  category: 'performance',
  execute: () => {
    const startTime = performance.now();
    
    // Simulate large dataset
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      id: `order-${i}`,
      order_number: `ORD-${String(i).padStart(4, '0')}`,
      status: 'pending',
      total_amount: Math.random() * 50,
    }));
    
    const endTime = performance.now();
    console.log(`Generated ${largeDataset.length} items in ${endTime - startTime}ms`);
    
    if (endTime - startTime > 100) {
      throw new Error('Dataset generation took too long');
    }
  },
});

testRunner.addScenario({
  name: 'Test Memory Usage',
  description: 'Monitor memory usage patterns',
  category: 'performance',
  execute: () => {
    // @ts-ignore
    if (performance.memory) {
      // @ts-ignore
      const memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
      console.log(`Current memory usage: ${memoryUsage.toFixed(2)} MB`);
      
      if (memoryUsage > 100) {
        console.warn('High memory usage detected');
      }
    }
  },
});

// =============================================================================
// ERROR TESTING SCENARIOS
// =============================================================================

testRunner.addScenario({
  name: 'Test Error Boundary',
  description: 'Trigger error boundary with synthetic error',
  category: 'error',
  execute: () => {
    // This would be triggered in a component that has ErrorBoundary
    throw new Error('Test error for error boundary');
  },
});

testRunner.addScenario({
  name: 'Test Network Error Handling',
  description: 'Simulate various network errors',
  category: 'error',
  execute: async () => {
    const { networkErrorHandler } = await import('@/lib/networkErrorHandler');
    
    // Test different error types
    const errors = [
      new Error('fetch failed'),
      { status: 404, message: 'Not found' },
      { status: 500, message: 'Internal server error' },
      { message: 'rate limit exceeded' },
    ];
    
    errors.forEach((error, index) => {
      networkErrorHandler.handleError(error, `test-${index}`);
    });
  },
});
