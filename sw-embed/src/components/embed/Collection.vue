<template>
  <span>
    <!-- the div with attribute sw-collection gets duplicated, so we need the outer wrapping div to give it a parent, otherwise it's directly attached to the shadow dom making things more complicated -->
    <div sw-collection>
      <slot name="header">
        <h3 sw-collection-name></h3>
      </slot>
      <slot name="media">
        <sw-media />
      </slot>
    </div>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CollectionModel from "@/models/Collection";
import SwMedia from "@/components/embed/Media.vue";
import DomHelpers from "@/lib/DomHelpers";

@Component({
  components: {
    SwMedia,
  },
})
export default class Collection extends Vue {
  static getMediaElement(collectionElement: Element): Element | null {
    const mediaComponent = collectionElement.querySelector("sw-media");
    if (!mediaComponent) {
      //fallback for custom layout inside vue app
      const mediaElements = collectionElement.querySelectorAll("[sw-media]");
      const mediaElement = DomHelpers.removeExistingAndReturnOne(mediaElements);
      if (!mediaElement) return null;
      return mediaElement;
    }

    const mediaComponentShadowRoot = mediaComponent.shadowRoot;
    if (!mediaComponentShadowRoot) return null;
    const mediaElements = mediaComponentShadowRoot.querySelectorAll("[sw-media]");
    const mediaElement = DomHelpers.removeExistingAndReturnOne(mediaElements);
    if (!mediaElement) return null;
    return mediaElement;
  }

  static fill(collectionNode: Node, collection: CollectionModel): void {
    let collectionElement = collectionNode as Element;
    let mediaElement = Collection.getMediaElement(collectionElement);

    const spanName = collectionElement.querySelector("[sw-collection-name]");
    if (spanName) {
      spanName.textContent = collection.name;
    }

    if (mediaElement) {
      const mediaParent = mediaElement.parentElement;
      if (mediaParent) {
        for (const media of collection.media) {
          let clone = mediaElement.cloneNode(true);
          mediaParent.appendChild(clone);
          SwMedia.fill(clone, media);
        }
        mediaElement.remove();
      }
    }

    return;
  }
}
</script>
