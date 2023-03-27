export type WeightedOption<T> = {
  option: T,
  weight: number,
};

export default class WeightedList<T = any> {
  public readonly options: WeightedOption<T>[] = [];

  public add(weight: number, option: T): WeightedList<T> {
    this.options.push({ option, weight });
    return this;
  }

  public select(): T {
    let totalWeights = 0;
    for (const { weight } of this.options) {
      totalWeights += weight;
    }

    let sum = 0;
    const r = Math.random() * totalWeights;
    for (const { option, weight } of this.options) {
      sum += weight;
      if (sum >= r) {
        return option;
      }
    }

    return this.options[0]?.option;
  }
}
