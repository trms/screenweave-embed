# Screenweave Embed

Use this to embed your Screenweave Channel in your website. Demos: <https://trms.github.io/screenweave-embed/>

## How to use

1. Include sw-embed.js and sw-embed.css
2. Include VideoJS (video.js and video-js.css) if you want videos to play
3. Put a tag `<sw-channel></sw-channel>` somewhere on your page and pass it the Invite Code of your channel.

That's it! An interface will be generated from your channel and allow browsing of all its Collections and playing individual videos, similar to the app. The interface is designed to inherit the styles of your site to fit in well out of the box.

## Examples
### Minimal example using default layout

```html
<!DOCTYPE html>
<html>
 <head>
  <meta charset="utf-8" />
  <script src="https://embed.screenweave.com/lib/sw-embed/v1.1.0/sw-embed.js" defer></script>
  <link rel="stylesheet" href="https://embed.screenweave.com/lib/sw-embed/v1.1.0/sw-embed.css" />
  <script src="https://vjs.zencdn.net/7.17.0/video.min.js" defer></script>
  <link href="https://vjs.zencdn.net/7.17.0/video-js.css" rel="stylesheet" />
  <title>Minimal example</title>
 </head>
 <body>
  <sw-channel sw-invite-code="INVITECODE"></sw-channel>
 </body>
</html>

```

### Custom layout

Putting any content inside a sw-* tag switches it to renderless mode where it only renders the markup you provide, and the data from your channel is applied to those tags with sw-* attributes. The "subcomponents" for collection and channel must only be specified once and will get automatically repeated per the content in your channel. This example custom layout is the same as the default layout.
You can also use the default layout for nested sw-* tags (by leaving them empty) while customizing the parent and/or siblings.
```html
<!DOCTYPE html>
<html>
 <head>
  <meta charset="utf-8" />
  <script src="https://embed.screenweave.com/lib/sw-embed/v1.1.0/sw-embed.js" defer></script>
  <link rel="stylesheet" href="https://embed.screenweave.com/lib/sw-embed/v1.1.0/sw-embed.css" />
  <script src="https://vjs.zencdn.net/7.17.0/video.min.js" defer></script>
  <link href="https://vjs.zencdn.net/7.17.0/video-js.css" rel="stylesheet" />
  <title>Custom Layout</title>
 </head>
 <body>
  <sw-channel sw-invite-code="INVITECODE">
   <img sw-channel-banner />
   <div>
    <div>
     <sw-collection>
      <h2 sw-collection-name></h2>
      <sw-media>
       <a href="#" sw-media-link>
        <img sw-media-thumbnail />
        <div sw-media-name></div>
       </a>
      </sw-media>
     </sw-collection>
    </div>
   </div>
   <sw-video-details>
    <div>
     <div>
      <div sw-player-video-tag-wrapper>
       <video class="video-js"></video>
      </div>
      <a href="#" sw-video-details-back>Back to Collections</a>
     </div>
     <div>
      <h2 sw-video-details-title></h2>
      <p sw-video-details-description></p>
     </div>
    </div>
   </sw-video-details>
   <sw-loading>
    <div></div>
   </sw-loading>
   <sw-error>
    ⚠ <span sw-error-code></span>
    <span sw-error-message></span>
   </sw-error>
  </sw-channel>
 </body>
</html>

```

### Very custom layout

Note that the more your custom layout deviates from the default, the less effective sw-embed.css will be at making it look good, thus very custom layouts may necessitate doing your own styles and not importing sw-embed.css, which is fine. You will still want the CSS file for videoJS unless you're also styling the player itself from scratch.
```html
 [ . . . ]
 <head>
  <meta charset="utf-8" />
  <script src="https://embed.screenweave.com/lib/sw-embed/v1.1.0/sw-embed.js" defer></script>
  <script src="https://vjs.zencdn.net/7.17.0/video.min.js" defer></script>
  <link href="https://vjs.zencdn.net/7.17.0/video-js.css" rel="stylesheet" />
 </head>
 [ . . . ]
```

### Standalone collection

- sw-collection can be used alone, without a sw-channel. In this case you'll need to give it the channel invite code and the id of the collection you want it to show.
- If using a custom layout, note that the layout for standalone is different compared to when this tag is used inside a channel.

```html
<!DOCTYPE html>
<html>
 <head>
  <meta charset="utf-8" />
  <script src="https://embed.screenweave.com/lib/sw-embed/v1.1.0/sw-embed.js" defer></script>
  <link rel="stylesheet" href="https://embed.screenweave.com/lib/sw-embed/v1.1.0/sw-embed.css" />
  <script src="https://vjs.zencdn.net/7.17.0/video.min.js" defer></script>
  <link href="https://vjs.zencdn.net/7.17.0/video-js.css" rel="stylesheet" />
  <title>Standalone collection</title>
 </head>
 <body>
  <sw-collection sw-invite-code="INVITECODE" sw-collection-id="1">
   <div>
    <h2 sw-collection-name></h2>
    <sw-media></sw-media>
   </div>
   <sw-video-details></sw-video-details>
   <sw-loading></sw-loading>
   <sw-error></sw-error>
  </sw-collection>
 </body>
</html>
```


### Standalone video details view and HREF navigation

- sw-video-details can be used alone, without a sw-channel. In this case you'll need to give it the channel invite code and the id of the video you want it to show.
    - If using a custom layout, note that the layout for standalone is different compared to when this tag is used inside a channel.
- A standalone sw-video-details can take a video ID directly via sw-video-id, or as the name of a query param that will contain the id via sw-video-id-param. If both are used AND the named query param actually exists, then sw-video-id-param will take precedence.
- All sw-media can optionally take a param sw-href which will cause it to navigate to another path when clicked, instead of switching to an inline video details view. In the given string `{id}` will be replaced with the video id.
    - When using sw-href on a sw-media you MAY omit the inline sw-video-details that the containing channel or standalone collection would normally require.
- All this means you can have your list of videos link to a separate page to show the video details without writing any more code
    - On pages with no video players of their own you don't need to include the VideoJS files.

#### File 1

```html
<!DOCTYPE html>
<html>
 <head>
  <meta charset="utf-8" />
  <script src="https://embed.screenweave.com/lib/sw-embed/v1.1.0/sw-embed.js" defer></script>
  <link rel="stylesheet" href="https://embed.screenweave.com/lib/sw-embed/v1.1.0/sw-embed.css" />
  <title>HREF navigation on individual videos</title>
 </head>
 <body>
  <sw-collection sw-invite-code="INVITECODE" sw-collection-id="1">
   <div>
    <h2 sw-collection-name></h2>
    <sw-media sw-href="details.html?vid={id}"></sw-media>
   </div>
   <sw-loading></sw-loading>
   <sw-error></sw-error>
  </sw-collection>
 </body>
</html>
```

#### File 2

```html
<!DOCTYPE html>
<html>
 <head>
  <meta charset="utf-8" />
  <script src="https://embed.screenweave.com/lib/sw-embed/v1.1.0/sw-embed.js" defer></script>
  <link rel="stylesheet" href="https://embed.screenweave.com/lib/sw-embed/v1.1.0/sw-embed.css" />
  <script src="https://vjs.zencdn.net/7.17.0/video.min.js" defer></script>
  <link href="https://vjs.zencdn.net/7.17.0/video-js.css" rel="stylesheet" />
  <title>Standalone Video Details which looks for a query param for video ID and also has a default</title>
 </head>
 <body>
  <sw-video-details sw-invite-code="INVITECODE" sw-video-id="1" sw-video-id-param="vid">
   <div>
    <div>
     <div sw-player-video-tag-wrapper>
      <video class="video-js"></video>
     </div>
     <a href="#" sw-video-details-back>Back to Collections</a>
    </div>
    <div>
     <h2 sw-video-details-title></h2>
     <p sw-video-details-description></p>
    </div>
   </div>
   <sw-loading></sw-loading>
   <sw-error></sw-error>
  </sw-video-details>
 </body>
</html>
```

### Player only + player.js support

- Embed just a player for 1 video by using a standalone video-details with a barebones custom layout.
- Enable player.js support by having player.js included on your page.

```html
<!DOCTYPE html>
<html>
 <head>
  <meta charset="utf-8" />
  <script src="https://embed.screenweave.com/lib/sw-embed/v1.1.0/sw-embed.js" defer></script>
  <link rel="stylesheet" href="https://embed.screenweave.com/lib/sw-embed/v1.1.0/sw-embed.css" />
  <script src="https://vjs.zencdn.net/7.17.0/video.min.js" defer></script>
  <link href="https://vjs.zencdn.net/7.17.0/video-js.css" rel="stylesheet" />
  <script src="https://cdn.embed.ly/player-0.1.0.min.js"></script>
  <title>Player Only</title>
 </head>
 <body>
  <sw-video-details sw-invite-code="INVITECODE" sw-video-id="1">
   <div sw-player-video-tag-wrapper>
    <video class="video-js"></video>
   </div>
   <sw-loading></sw-loading>
   <sw-error></sw-error>
  </sw-video-details>
 </body>
</html>

```
