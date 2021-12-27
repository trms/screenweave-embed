# screenweave embed

Use this to embed your Screenweave Channel in your website. Demo: <https://trms.github.io/screenweave-embed/>

## How to use

1. Include sw-embed.js
2. Include sw-embed.css unless you plan to style the channel from scratch
3. Put a tag `<sw-channel></sw-channel>` somewhere on your page and pass it the Invite Code of your channel.

That's it! An interface wil be generated from your channel and allow browsing of all its Collections and playing individual videos, similar to the app. The interface is designed to inherit the styles of your site to fit in well out of the box.

## Examples
### Minimal example using default layout

```html
<!DOCTYPE html>
<html>
 <head>
  <meta charset="utf-8" />
  <script src="sw-embed/dist/sw-embed.js" defer></script>
  <link rel="stylesheet" href="sw-embed/dist/sw-embed.css" />
 </head>
 <body>
  <sw-channel code="INVITECODE"></sw-channel>
 </body>
</html>
```

### Fully custom layout

Putting any content inside a sw-* tag switches it to renderless mode where it only renders the markup you provide, and the data from your channel is applied to those tags with sw-* attributes. The "subcomponents" for collection and channel must only be specified once and will get automatically repeated per the content in your channel. This example custom layout is the same as the default layout.
```html
<!DOCTYPE html>
<html>
 <head>
  <meta charset="utf-8" />
  <script src="sw-embed/dist/sw-embed.js" defer></script>
  <link rel="stylesheet" href="sw-embed/dist/sw-embed.css" />
 </head>
 <body>
  <sw-channel code="INVITECODE">
   <img sw-channel-banner />
   <sw-collection>
    <h2 sw-collection-name></h2>
    <sw-media>
     <a href="#" sw-media-link>
      <img sw-media-thumbnail />
      <div sw-media-name></div>
     </a>    
    </sw-media>
   </sw-collection>
   <sw-video-details>
    <img sw-video-details-thumbnail />
    <h2 sw-video-details-title></h2>
    <p sw-video-details-description></p>
    <button type="button" sw-video-details-play-button>▶ Play</button>
    <a href="#" sw-video-details-back>Back to Collections</a>
   </sw-video-details>
   <sw-player>
    <div sw-player-video-tag-wrapper>
     <video class="video-js"></video>
    </div>
    <a href="#" sw-player-back>Back to Collections</a>
   </sw-player>
  </sw-channel>
 </body>
</html>
```
Note that the more your custom layout deviates from the default, the less effective sw-embed.css will be at making it look good, thus very custom layouts may necessitate a custom replacement for sw-embed.css.

### Partially custom layout

You can use the default layout for nested sw-* tags (by leaving them empty) while customizing the parent and/or siblings.
```html
<!DOCTYPE html>
<html>
 <head>
  <meta charset="utf-8" />
  <script src="sw-embed/dist/sw-embed.js" defer></script>
  <link rel="stylesheet" href="sw-embed/dist/sw-embed.css" />
 </head>
 <body>
  <sw-channel code="INVITECODE">
   <img sw-channel-banner />
   <sw-collection></sw-collection>
   <sw-video-details>
    <img sw-video-details-thumbnail />
    <h2 sw-video-details-title></h2>
    <p sw-video-details-description></p>
    <button type="button" sw-video-details-play-button>▶ Play</button>
    <a href="#" sw-video-details-back>Back to Collections</a>
   </sw-video-details>
   <sw-player></sw-player>
  </sw-channel>
 </body>
</html>
```
