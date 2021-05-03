import { VM } from 'vm2';
import util from 'util';

const VM_OPTIONS = {
  timeout: 5000,
  sandbox: {},
  eval: false,
  wasm: false,
};

export function safeEval(code: string): EvalResult {
  const vm = new VM(VM_OPTIONS);
  try {
    const result = vm.run(code);
    const text = customInspect(result, 2);
    return { text };
  } catch (error) {
    return { error };
  }
}

interface EvalResult {
  text?: string,
  error?: Error,
}

function customInspect(obj: any, depth: number): string {
  if (typeof obj === 'string' || typeof obj === 'number') {
    return obj.toString();
  }
  if (depth >= 0 && Array.isArray(obj)) {
    const arrItemStrings = obj.map((item) => customInspect(item, depth - 1));
    return `[${arrItemStrings.join(', ')}]`;
  }
  return util.inspect(obj);
}
