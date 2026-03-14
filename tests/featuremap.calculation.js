import { test as calculation } from '@playwright/test';
import { calculateYamlCoverage } from 'feature-map';

calculation.describe('@COVERAGE', () => {
  calculation('Feature Map', async () => {
    const runCalculationCoverage = process.env.CALCULATE_COVERAGE;
    if (runCalculationCoverage) {
      console.log('Calculating coverage');
      calculateYamlCoverage('./coverageFeatureMap.yml');
    } else {
      console.log('Skipping coverage calculation');
    }
  });
});
