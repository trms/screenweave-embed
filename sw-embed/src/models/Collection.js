import Model from "./Model.js";

export default class Collection extends Model {
  name = "";
  media = [];

  constructor(initData) {
    super();
    this.name = initData.name;
    this.media = initData.media;
  }
}
