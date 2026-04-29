export abstract class WatchedList<T> {
  protected currentItems: T[];
  protected initialItems: T[];
  protected addedItems: T[];
  protected removedItems: T[];

  constructor(initialItems: T[]) {
    const items = initialItems ? [...initialItems] : [];
    this.currentItems = [...items];
    this.initialItems = [...items];
    this.addedItems = [];
    this.removedItems = [];
  }

  abstract compareItems(a: T, b: T): boolean;

  getItems(): ReadonlyArray<T> {
    return this.currentItems;
  }

  getAddedItems(): ReadonlyArray<T> {
    return this.addedItems;
  }

  getRemovedItems(): ReadonlyArray<T> {
    return this.removedItems;
  }

  exists(item: T): boolean {
    return this.isCurrentItem(item);
  }

  private isCurrentItem(item: T): boolean {
    return this.currentItems.some((current) => this.compareItems(item, current));
  }

  private isAddedItem(item: T): boolean {
    return this.addedItems.some((added) => this.compareItems(item, added));
  }

  private isRemovedItem(item: T): boolean {
    return this.removedItems.some((removed) => this.compareItems(item, removed));
  }

  private isInitialItem(item: T): boolean {
    return this.initialItems.some((initial) => this.compareItems(item, initial));
  }

  private removeFromCurrent(item: T): void {
    this.currentItems = this.currentItems.filter((current) => !this.compareItems(item, current));
  }

  private removeFromAdded(item: T): void {
    this.addedItems = this.addedItems.filter((added) => !this.compareItems(item, added));
  }

  private removeFromRemoved(item: T): void {
    this.removedItems = this.removedItems.filter((removed) => !this.compareItems(item, removed));
  }

  add(item: T): void {
    if (this.isCurrentItem(item)) {
      return;
    }

    this.currentItems.push(item);

    if (this.isRemovedItem(item)) {
      this.removeFromRemoved(item);
    } else if (!this.isInitialItem(item)) {
      this.addedItems.push(item);
    }
  }

  remove(item: T): void {
    if (!this.isCurrentItem(item)) {
      return;
    }

    this.removeFromCurrent(item);

    if (this.isAddedItem(item)) {
      this.removeFromAdded(item);
    } else if (this.isInitialItem(item)) {
      this.removedItems.push(item);
    }
  }
}
