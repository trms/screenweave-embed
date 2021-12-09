<template>
  <div class="helloWorld">
    <template v-if="mode == DemoMode.Default">
      <sw-channel :id="0" />
    </template>

    <template v-else-if="mode == DemoMode.Explicit">
      <sw-channel id="0">
        <div slot="header">
          <img sw-channel-banner />
        </div>
        <div slot="collections">
          <div class="swChannelCollectionContainer">
            <sw-collection>
              <div slot="header">
                <h3 sw-collection-name></h3>
              </div>
              <span slot="media">
                <sw-media>
                  <span slot="media">
                    <a sw-media-link>
                      <img sw-media-thumbnail />
                      <br />
                      <span sw-media-name></span>
                    </a>
                  </span>
                </sw-media>
              </span>
            </sw-collection>
          </div>
        </div>
      </sw-channel>
    </template>

    <template v-else>Set a demo mode</template>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SwChannel from "@/components/embed/Channel.vue";
import SwCollection from "@/components/embed/Collection.vue";
import SwMedia from "@/components/embed/Media.vue";

enum DemoMode {
  Default,
  Explicit,
  Alternate,
}

@Component({
  components: {
    SwChannel,
    SwCollection,
    SwMedia,
  },
})
export default class HelloWorld extends Vue {
  DemoMode = DemoMode;
  mode = DemoMode.Explicit;
}
</script>

<style scoped>
.helloWorld {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  text-align: center;
  width: 100%;
}

[sw-channel-banner] {
  width: 100%;
}
.swChannelCollectionContainer {
  text-align: left;
  margin: 0 100px 0 100px;
}

[sw-media-link] {
  color: black;
  text-decoration: none;
  display: inline-block;
  margin-right: 2em;
}
[sw-media-link] > img {
  width: 217px;
  height: 128px;
}
[sw-media-name] {
  color: rgb(100, 100, 100);
  font-size: 80%;
}
</style>
