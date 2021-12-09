export default class Media {
  name!: string;
  url!: string;
  thumbnailUrl!: string;

  constructor(initData: Media) {
    this.name = initData.name;
    this.url = initData.url;
    this.thumbnailUrl = initData.thumbnailUrl;
  }
}
