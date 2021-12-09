export default class DomHelpers {
  static removeExistingAndReturnOne(things: any): Element | null {
    let first = true;
    for (const t of things) {
      if (first) {
        first = false;
        continue;
      }
      t.remove();
    }
    const thing = things[0];
    if (!thing) return null;
    return thing as Element;
  }
}
