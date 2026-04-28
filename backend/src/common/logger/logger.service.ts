import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class AppLogger implements LoggerService {
  private context?: string;

  constructor() {
    // Nothing needed
  }

  log(message: string, context?: string) {
    const ctx = context || 'App';
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [INFO] [${ctx}] ${message}`);
  }

  error(message: string, trace?: string, context?: string) {
    const ctx = context || 'App';
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [ERROR] [${ctx}] ${message}`);
    if (trace) {
      console.error(`[${timestamp}] [ERROR] [${ctx}] Stack: ${trace}`);
    }
  }

  warn(message: string, context?: string) {
    const ctx = context || 'App';
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] [WARN] [${ctx}] ${message}`);
  }

  debug(message: string, context?: string) {
    const ctx = context || 'App';
    const timestamp = new Date().toISOString();
    console.debug(`[${timestamp}] [DEBUG] [${ctx}] ${message}`);
  }

  verbose(message: string, context?: string) {
    const ctx = context || 'App';
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [VERBOSE] [${ctx}] ${message}`);
  }

  setContext(context: string) {
    this.context = context;
  }
}