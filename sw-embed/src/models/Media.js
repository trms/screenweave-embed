import Model from "./Model.js";

export default class Media extends Model {
  url = "";
  type = "";
  title = "";
  smallThumbnailUrl = "";
  mediumThumbnailUrl = "";
  largeThumbnailUrl = "";
  showId = "";
  description = "";

  constructor(initData) {
    super();
    if(initData.url) this.url = initData.url;
    if(initData.type) this.type = initData.type;
    if(initData.title) this.title = initData.title;
    if(initData.smallThumbnailUrl) this.smallThumbnailUrl = initData.smallThumbnailUrl;
    if(initData.mediumThumbnailUrl) this.mediumThumbnailUrl = initData.mediumThumbnailUrl;
    if(initData.largeThumbnailUrl) this.largeThumbnailUrl = initData.largeThumbnailUrl;
    if(initData.showId) this.showId = initData.showId;
    if(initData.description) this.description = initData.description;
  }
}
