export default class IncludeMedia {
  static async insertData(mediaElement, mediaObject, videoDetailsCallback) {
    const href = mediaElement.getAttribute("sw-href");
    for(const mediaLinkElement of mediaElement.querySelectorAll("[sw-media-link]")) {
      if(href) {
        mediaLinkElement.setAttribute("href", href.replaceAll("{id}", mediaObject.showId)); 
      }else{
        mediaLinkElement.onclick = videoDetailsCallback;
      }
    }
    for(const mediaThumbnailElement of mediaElement.querySelectorAll("[sw-media-thumbnail]"))
      mediaThumbnailElement.setAttribute("src", mediaObject.thumbnailUrl);
    for(const mediaNameElement of mediaElement.querySelectorAll("[sw-media-name]"))
      mediaNameElement.textContent = mediaObject.title;
  }
}