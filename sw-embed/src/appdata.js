import "core-js";
import "regenerator-runtime/runtime";

import Media from "./models/Media.js";
import Channel from "./models/Channel.js";
import Collection from "./models/Collection.js";

export default class Appdata {
  //static apiUrl = "https://screenweave-launch.herokuapp.com/api/";
  //static apiUrl = "https://api.screenweave.com/appdata/";
  static apiUrl = "http://192.168.7.55:8080/";

  /*
    returns {jwt, channelIdAdded, channelIdRemoved}
  */
  static async subscribe(inviteCode, existingJwt = null) {
    const url = Appdata.apiUrl + "appdata/subscribe";
    const postData = {inviteCodeToRedeem: inviteCode};
    let headers = { "Content-Type": "application/json" };
    if (existingJwt) {
      headers.Authorization = "Bearer " + existingJwt;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(postData),
    });
    if(!response.ok) return null;
    return await response.json();
  }

  static async getCollections(channelId, jwt) {
    const url = Appdata.apiUrl +`appdata/channels/${channelId}/collections`;
    let headers = { "Content-Type": "application/json", "Authorization": "Bearer " + jwt };
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    return (await response.json()).collections;
  }

  static async getChannels(jwt) {
    const url = Appdata.apiUrl +`appdata/channels`;
    let headers = { "Content-Type": "application/json", "Authorization": "Bearer " + jwt };
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    return (await response.json()).channels;
  }

  static async loadData(channelElements) {
    //get invite codes from attrs
    let inviteCodes = [];
    for(const channelElement of channelElements) {
      const inviteCode = channelElement.getAttribute("code");
      if(inviteCode) inviteCodes.push(inviteCode);
    }

    //get local cached jwt info, if any
    let jwtInfoJson = localStorage.getItem("jwtInfo");
    let jwtInfoDecoded = {jwt: null, code2id: {}};
    if(jwtInfoJson) {
      jwtInfoDecoded = JSON.parse(jwtInfoJson); 
    }
    //make sure all channels requested are in jwt
    for(const inviteCode of inviteCodes) {
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
      const appdataCollections = await Appdata.getCollections(appdataChannel.id, jwtInfoDecoded.jwt);
      if(!appdataCollections) return null;
      let outCollections = [];
      for(const appdataCollection of appdataCollections) {
        let outMedia = [];
        for(const appdataVideo of appdataCollection.videos) {
          let thumbnailUrl = "";
          for (const [key, value] of Object.entries(appdataVideo.thumbnails)) {
            thumbnailUrl = value;
            break;
          }
          outMedia.push(new Media({url: appdataVideo.url, type: appdataVideo.type, title: appdataVideo.title, thumbnailUrl: thumbnailUrl, showId: appdataVideo.show_id, description: appdataVideo.description}));
        }
        outCollections.push(new Collection({name: appdataCollection.name, media: outMedia}));
      }
      outChannels[appdataChannel.id] = new Channel({id: appdataChannel.id, name: appdataChannel.name, collections: outCollections, bannerUrl: appdataChannel.banner_url, logoUrl: appdataChannel.logo_url});
    }

    return {channelsById: outChannels, code2id: jwtInfoDecoded.code2id};
  }
}
