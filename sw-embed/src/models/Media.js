export default class Media {
  name = "";
  url = "";
  thumbnailUrl = "";

  constructor(initData) {
    this.name = initData.name;
    this.url = initData.url;
    this.thumbnailUrl = initData.thumbnailUrl;
  }
}
