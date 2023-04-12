import { Reporter } from './service';
import { ReporterConstructor } from './types';

let reporter: Reporter | null = null;

export const createReporter: ReporterConstructor = (...args) => {
  if (reporter) {
    return;
  }
  reporter = new Reporter(...args);
};

export const captureException = (params: ErrorEvent) => {
  if (!reporter) {
    throw new Error('Reporter is not initialized');
  }

  reporter.captureException(params);
};

export const destroy = () => {
  reporter = null;
};
