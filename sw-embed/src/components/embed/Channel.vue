<template>
  <div v-if="disabledMessage === null" sw-channel>
    <span sw-channel-header-wrapper>
      <slot name="header">
        <img sw-channel-banner />
      </slot>
    </span>
    <span sw-channel-collection-wrapper>
      <slot name="collections">
        <div>
          <sw-collection />
        </div>
      </slot>
    </span>
  </div>
  <div v-else>{{ disabledMessage }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import ChannelModel from "@/models/Channel";
import SwCollection from "@/components/embed/Collection.vue";
import DomHelpers from "@/lib/DomHelpers";

@Component({
  components: {
    SwCollection,
  },
})
export default class Channel extends Vue {
  @Prop() id!: number;
  channel: ChannelModel | null = null;
  disabledMessage: string | null = null;

  created(): void {
    const mocks = ChannelModel.getMocks();
    if (this.id < mocks.length) {
      this.channel = ChannelModel.getMocks()[this.id];
    } else {
      this.disabledMessage = `Invalid channel ID ${this.id} -- exclusive max: ${mocks.length}`;
      return;
    }
  }

  mounted(): void {
    this.$nextTick(() => {
      this.fill();
    });
  }

  updated(): void {
    this.$nextTick(() => {
      this.fill();
    });
  }

  getHeaderSlot(): Element | null {
    const headerSlot = this.$slots.header;
    if (!headerSlot) {
      //fallback for default layout inside vue app
      const headerWrapper = this.$el.querySelector(
        "[sw-channel-header-wrapper]"
      );
      if (!headerWrapper) return null;
      return headerWrapper as Element;
    }
    const headerSlotInstance = headerSlot[0].elm;
    if (!headerSlotInstance) return null;
    return headerSlotInstance as Element;
  }

  getCollectionElement(): Element | null {
    const collectionSlot = this.$slots.collections;
    if (!collectionSlot) {
      //fallback for default layout inside vue app
      const collectionWrappers = this.$el.querySelectorAll("[sw-collection]");
      const collectionWrapper = DomHelpers.removeExistingAndReturnOne(collectionWrappers);
      if (!collectionWrapper) return null;
      return collectionWrapper;
    }
    const collectionSlotInstance = collectionSlot[0].elm;
    if (!collectionSlotInstance) return null;
    const collectionComponent = (collectionSlotInstance as Element).querySelector("sw-collection");
    if (!collectionComponent) {
      //fallback for customized layout inside vue app
      const collectionElements = (collectionSlotInstance as Element).querySelectorAll("[sw-collection]");
      const collectionElement = DomHelpers.removeExistingAndReturnOne(collectionElements);
      if (!collectionElement) return null;
      return collectionElement;
    }
    const collectionComponentShadowRoot = collectionComponent.shadowRoot;
    if (!collectionComponentShadowRoot) return null;
    const collectionElements = collectionComponentShadowRoot.querySelectorAll("[sw-collection]");
    const collectionElement = DomHelpers.removeExistingAndReturnOne(collectionElements);
    if (!collectionElement) return null;
    return collectionElement;
  }

  fill(): void {
    const headerSlot = this.getHeaderSlot();
    const collectionElement = this.getCollectionElement();
    if (!this.channel || !headerSlot || !collectionElement) return;

    const imgBanner = headerSlot.querySelector("[sw-channel-banner]");
    if (imgBanner) {
      imgBanner.setAttribute("src", this.channel.bannerUrl);
    }

    const collectionParent = collectionElement.parentElement;
    if (collectionParent) {
      for (const collection of this.channel.collections) {
        let clone = collectionElement.cloneNode(true);
        collectionParent.appendChild(clone);
        SwCollection.fill(clone, collection);
      }
      collectionElement.remove();
    }
  }
}
</script>

<style scoped>
[sw-channel-banner] {
  width: 100%;
}
[sw-channel-collection-wrapper] div {
  text-align: left;
  margin: 0 100px 0 100px;
}
</style>
