export default class Collection {
  name = "";
  media = [];

  constructor(initData) {
    this.name = initData.name;
    this.media = initData.media;
  }
}
