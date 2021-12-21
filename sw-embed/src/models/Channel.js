import Model from "./Model.js";
import Collection from "./Collection";
import Media from "./Media";

export default class Channel extends Model{
  id = 0;
  name = "";
  collections = [];
  bannerUrl = "";
  logoUrl = "";

  constructor(initData) {
    super();
    if(initData.id) this.id = initData.id;
    if(initData.name) this.name = initData.name;
    if(initData.collections) this.collections = initData.collections;
    if(initData.bannerUrl) this.bannerUrl = initData.bannerUrl;
    if(initData.logoUrl) this.logoUrl = initData.logoUrl;
  }
}
