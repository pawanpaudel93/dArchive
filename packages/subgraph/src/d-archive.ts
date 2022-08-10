import { crypto, ByteArray, Bytes } from "@graphprotocol/graph-ts";
import { ArchiveAdded as ArchiveAddedEvent } from "../generated/DArchive/DArchive";
import { Archive, Url } from "../generated/schema";

export function handleArchiveAdded(event: ArchiveAddedEvent): void {
  let urlID = Bytes.fromByteArray(
    crypto.keccak256(ByteArray.fromUTF8(event.params.contentURL))
  );
  let archive = Archive.load(event.params.ID.toString());
  let url = Url.load(urlID);

  if (!url) {
    url = new Url(urlID);
    url.url = event.params.contentURL;
    url.save();
  }

  if (!archive) {
    archive = new Archive(event.params.ID.toString());

    archive.title = event.params.title;
    archive.timestamp = event.params.timestamp;
    archive.contentID = event.params.contentID;
    archive.contentURL = urlID;

    archive.save();
  }
}
