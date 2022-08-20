import { crypto, ByteArray, ipfs, json } from "@graphprotocol/graph-ts";
import { ArchiveAdded as ArchiveAddedEvent } from "../generated/DArchive/DArchive";
import { Archive, Url } from "../generated/schema";

export function handleArchiveAdded(event: ArchiveAddedEvent): void {
  let metadata = ipfs.cat(event.params.contentID + "/metadata.json");
  if (metadata) {
    const metadataJson = json.fromBytes(metadata).toObject();
    const contentURL = metadataJson.get("url");
    if (contentURL) {
      let urlID = crypto
        .keccak256(ByteArray.fromUTF8(contentURL.toString()))
        .toHex();

      let archiveID = crypto
        .keccak256(ByteArray.fromUTF8(event.params.contentID))
        .toHex();

      let archive = Archive.load(archiveID);
      let url = Url.load(urlID);

      if (!url) {
        url = new Url(urlID);
        url.url = contentURL.toString();
        url.save();
      }

      if (!archive) {
        archive = new Archive(archiveID);
        const title = metadataJson.get("title");
        if (title) {
          archive.title = title.toString();
        }
        archive.timestamp = event.block.timestamp;
        archive.contentID = event.params.contentID;
        archive.urlID = urlID;
        archive.save();
      }
    }
  }
}
