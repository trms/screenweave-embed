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

### Custom layout

Putting any content inside a sw-* tag switches it to renderless mode where it only renders the markup you provide, and the data from your channel is applied to those tags with sw-* attributes. The "subcomponents" for collection and channel must only be specified once and will get automatically repeated per the content in your channel. This example custom layout is the same as the default layout.
You can also use the default layout for nested sw-* tags (by leaving them empty) while customizing the parent and/or siblings.
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
    <sw-video-details>
     <div>
      <img sw-video-details-thumbnail />
      <a href="#" sw-video-details-back>Back to Collections</a>
     </div>
     <div>
      <h2 sw-video-details-title></h2>
      <p sw-video-details-description></p>
      <button type="button" sw-video-details-play-button>
       <img src="data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhciIgZGF0YS1pY29uPSJwbGF5LWNpcmNsZSIgY2xhc3M9InN2Zy1pbmxpbmUtLWZhIGZhLXBsYXktY2lyY2xlIGZhLXctMTYiIHJvbGU9ImltZyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMzcxLjcgMjM4bC0xNzYtMTA3Yy0xNS44LTguOC0zNS43IDIuNS0zNS43IDIxdjIwOGMwIDE4LjQgMTkuOCAyOS44IDM1LjcgMjFsMTc2LTEwMWMxNi40LTkuMSAxNi40LTMyLjggMC00MnpNNTA0IDI1NkM1MDQgMTE5IDM5MyA4IDI1NiA4UzggMTE5IDggMjU2czExMSAyNDggMjQ4IDI0OCAyNDgtMTExIDI0OC0yNDh6bS00NDggMGMwLTExMC41IDg5LjUtMjAwIDIwMC0yMDBzMjAwIDg5LjUgMjAwIDIwMC04OS41IDIwMC0yMDAgMjAwUzU2IDM2Ni41IDU2IDI1NnoiPjwvcGF0aD48L3N2Zz4=" />
       Play
      </button>
     </div>
    </sw-video-details>
    <sw-player>
     <div sw-player-video-tag-wrapper>
      <video class="video-js"></video>
     </div>
     <a href="#" sw-player-back>Back to Collections</a>
    </sw-player>
   </div>
  </sw-channel>
 </body>
</html>
```

### Very custom layout

Note that the more your custom layout deviates from the default, the less effective sw-embed.css will be at making it look good, thus very custom layouts may necessitate doing your own styles and not importing sw-embed.css -- in this case you'll probably want to still import the styles for the video player directly.
```html
 [ . . . ]
 <head>
  <meta charset="utf-8" />
  <script src="sw-embed/dist/sw-embed.js" defer></script>
  <link href="https://vjs.zencdn.net/7.17.0/video-js.css" rel="stylesheet" />
 </head>
 [ . . . ]
```
