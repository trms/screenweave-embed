<template>
  <span>
    <div sw-media>
      <slot name="media">
        <a sw-media-link>
          <img sw-media-thumbnail />
          <br />
          <span sw-media-name></span>
        </a>
      </slot>
    </div>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MediaModel from "@/models/Media";

@Component
export default class Media extends Vue {
  static fill(mediaNode: Node, media: MediaModel): void {
    let mediaElement = mediaNode as Element;
    const imgThumbnail = mediaElement.querySelector("[sw-media-thumbnail]");
    if (imgThumbnail) {
      imgThumbnail.setAttribute("src", media.thumbnailUrl);
    }

    const spanName = mediaElement.querySelector("[sw-media-name]");
    if (spanName) {
      spanName.textContent = media.name;
    }

    const link = mediaElement.querySelector("[sw-media-link]");
    if (link) {
      link.setAttribute("href", media.url);
    }
    return;
  }
}
</script>

<style scoped>
[sw-media] {
  display: inline;
}
[sw-media-link] {
  color: black;
  text-decoration: none;
  display: inline-block;
  margin-right: 2em;
}
[sw-media-link] img {
  width: 217px;
  height: 128px;
}
[sw-media-name] {
  color: rgb(100, 100, 100);
  font-size: 80%;
}
</style>
