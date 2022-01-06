import Model from "./Model.js";

export default class Collection extends Model {
  id = 0;
  name = "";
  media = [];

  constructor(initData) {
    super();
    this.id = initData.id;
    this.name = initData.name;
    this.media = initData.media;
  }
}
