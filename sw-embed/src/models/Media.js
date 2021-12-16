import Model from "./Model.js";

export default class Media extends Model {
  url = "";
  type = "";
  title = "";
  thumbnailUrl = "";
  showId = "";
  description = "";

  constructor(initData) {
    super();
    if(initData.url) this.url = initData.url;
    if(initData.type) this.type = initData.type;
    if(initData.title) this.title = initData.title;
    if(initData.thumbnailUrl) this.thumbnailUrl = initData.thumbnailUrl;
    if(initData.showId) this.showId = initData.showId;
    if(initData.description) this.description = initData.description;
  }
}
