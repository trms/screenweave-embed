import Media from "@/models/Media";

export default class Collection {
  name!: string;
  media!: Array<Media>;

  constructor(initData: Collection) {
    this.name = initData.name;
    this.media = initData.media;
  }
}
