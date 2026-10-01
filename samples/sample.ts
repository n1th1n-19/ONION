// Onion syntax sample for TypeScript
import type { Readable } from 'node:stream';

export enum Layer { Skin = 'skin', Flesh = 'flesh', Core = 'core' }

export interface Peelable<T extends object = {}> {
  readonly id: string;
  peel(depth?: number): Promise<T[]>;
}

type Keys<T> = keyof T;
type Unwrap<T> = T extends Promise<infer U> ? U : T;
declare const config: { strict: boolean } | undefined;

function log(target: unknown, key: string, desc: PropertyDescriptor): void {}

export abstract class Vegetable<T> implements Peelable<{ layer: Layer }> {
  private static count = 0;
  protected constructor(public readonly id: string, private items: T[] = []) {
    super?.constructor;
  }

  @log
  async peel(depth = 1): Promise<{ layer: Layer }[]> {
    const result = this.items.slice(0, depth) as unknown as { layer: Layer }[];
    return result satisfies object[];
  }

  abstract weigh(): number;
}

export const stream = (s: Readable): Unwrap<Promise<string>> => `${s.readable ?? config?.strict}`;
const map = new Map<string, number>([['red', 1]]);
let maybe: number | null = map.get('red')!;
