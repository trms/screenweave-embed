import "core-js";
import "regenerator-runtime/runtime";

import Media from "./models/Media.js";
import Channel from "./models/Channel.js";
import Collection from "./models/Collection.js";

export default class Appdata {
  //static apiUrl = "https://screenweave-next.herokuapp.com/"; //stage
  //static apiUrl = "https://api.screenweave.com/"; //prod
  static apiUrl = "https://launch.screenweave.com/"; //prod
  //static apiUrl = "http://192.168.7.55:8080/"; //local dev
  //static apiUrl = "http://localhost:5000/"; //local dev

  /*
    returns {jwt, channelIdAdded, channelIdRemoved}
  */
  static async subscribe(inviteCode, existingJwt = null) {
    const url = Appdata.apiUrl + "appdata/subscribe";
    const postData = {inviteCodeToRedeem: inviteCode};
    let headers = { "Content-Type": "application/json" };
    if (existingJwt != null) {
      headers.Authorization = "Bearer " + existingJwt;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(postData),
    });
    if(!response.ok) {
      console.log("[Appdata API] Subscribe returned failure code");
      return null;
    }
    return await response.json();
  }

  static async getCollections(channelId, jwt) {
    const url = Appdata.apiUrl +`appdata/channels/${channelId}/collections`;
    let headers = { "Content-Type": "application/json", "Authorization": "Bearer " + jwt };
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    if(!response.ok) {
      console.log("[Appdata API] Collections returned failure code");
      return null;
    }
    return (await response.json()).collections;
  }

  static async getChannels(jwt) {
    const url = Appdata.apiUrl +`appdata/channels`;
    let headers = { "Content-Type": "application/json", "Authorization": "Bearer " + jwt };
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    if(!response.ok) {
      console.log("[Appdata API] Channels returned failure code");
      return null;
    }
    return (await response.json()).channels;
  }

  static async loadData(inviteCodes) {
    //get local cached jwt info, if any
    let jwtInfoJson = localStorage.getItem("jwtInfo");
    let jwtInfoDecoded = {jwt: null, code2id: {}};
    if(jwtInfoJson) {
      jwtInfoDecoded = JSON.parse(jwtInfoJson); 
    }
    //make sure all channels requested are in jwt
    for(const inviteCode of inviteCodes) {
      if(!inviteCode) continue;
      if(jwtInfoDecoded.code2id[inviteCode]) continue;
      const jwtResponse = jwtInfoDecoded.jwt === null ? await Appdata.subscribe(inviteCode) : await Appdata.subscribe(inviteCode, jwtInfoDecoded.jwt);
      if(!jwtResponse) return null;
      jwtInfoDecoded.jwt = jwtResponse.jwt;
      jwtInfoDecoded.code2id[inviteCode] = jwtResponse.channelIdAdded;
    }
    jwtInfoJson = JSON.stringify(jwtInfoDecoded);
    localStorage.setItem("jwtInfo", jwtInfoJson);
    
    //pull data
    let outChannels = {};
    const appdataChannels = await Appdata.getChannels(jwtInfoDecoded.jwt);
    if(!appdataChannels) return null;
    for (const appdataChannel of appdataChannels) {
      if(!appdataChannel) continue;
      const appdataCollections = await Appdata.getCollections(appdataChannel.id, jwtInfoDecoded.jwt);
      if(!appdataCollections) return null;
      let outCollections = [];
      for(const appdataCollection of appdataCollections) {
        if(!appdataCollection) continue;
        let outMedia = [];
        for(const appdataVideo of appdataCollection.videos) {
          outMedia.push(new Media({
            url: appdataVideo.url,
            type: appdataVideo.type,
            title: appdataVideo.title,
            smallThumbnailUrl: appdataVideo.thumbnails["small"],
            mediumThumbnailUrl: appdataVideo.thumbnails["medium"],
            largeThumbnailUrl: appdataVideo.thumbnails["large"],
            showId: appdataVideo.show_id,
            description: appdataVideo.description
          }));
        }
        outCollections.push(new Collection({id: appdataCollection.id, name: appdataCollection.name, media: outMedia}));
      }
      outChannels[appdataChannel.id] = new Channel({id: appdataChannel.id, name: appdataChannel.name, collections: outCollections, bannerUrl: appdataChannel.banner_url, logoUrl: appdataChannel.logo_url});
    }

    return {channelsById: outChannels, code2id: jwtInfoDecoded.code2id};
  }
}
