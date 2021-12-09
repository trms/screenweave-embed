import Collection from "@/models/Collection";
import Media from "@/models/Media";

export default class Channel {
  name!: string;
  collections!: Array<Collection>;
  bannerUrl!: string;

  constructor(initData: Channel) {
    this.name = initData.name;
    this.collections = initData.collections;
    this.bannerUrl = initData.bannerUrl;
  }

  static getMocks(): Array<Channel> {
    const imageContext = require.context("../assets/", false, /\.png$/);
    return [
      new Channel({
        name: "City of Huntington Beach",
        collections: [
          new Collection({
            name: "Live Streams",
            media: [
              new Media({name: "Livestream Title 1", url: "http://example.com/1", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
              new Media({name: "Livestream Title 2", url: "http://example.com/2", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
              new Media({name: "Livestream Title 3", url: "http://example.com/3", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
            ],
          }),
          new Collection({
            name: "Latest Videos",
            media: [
              new Media({name: "Video 1", url: "http://example.com/4", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
              new Media({name: "Video 2", url: "http://example.com/5", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
              new Media({name: "Video 3", url: "http://example.com/6", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
            ],
          }),
          new Collection({
            name: "Archive",
            media: [
              new Media({name: "Video 1", url: "http://example.com/7", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
              new Media({name: "Video 2", url: "http://example.com/8", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
              new Media({name: "Video 3", url: "http://example.com/9", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
            ],
          }),
        ],
        bannerUrl: imageContext("./topshelf-ultra-wide-2x.png"),
      }),
      new Channel({
        name: "CMAC",
        collections: [
          new Collection({
            name: "Live Streams",
            media: [
              new Media({name: "Livestream Title 1", url: "http://example.com/10", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
              new Media({name: "Livestream Title 2", url: "http://example.com/11", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
              new Media({name: "Livestream Title 3", url: "http://example.com/12", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
            ],
          }),
          new Collection({
            name: "Latest Videos",
            media: [
              new Media({name: "Video 1", url: "http://example.com/13", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
              new Media({name: "Video 2", url: "http://example.com/14", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
              new Media({name: "Video 3", url: "http://example.com/15", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
            ],
          }),
          new Collection({
            name: "Archive",
            media: [
              new Media({name: "Video 1", url: "http://example.com/16", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
              new Media({name: "Video 2", url: "http://example.com/17", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
              new Media({name: "Video 3", url: "http://example.com/18", thumbnailUrl: "https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg"}),
            ],
          }),
        ],
        bannerUrl: imageContext("./logo.png"),
      }),
    ];
  }
}
