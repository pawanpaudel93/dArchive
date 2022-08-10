import { ArchiveAdded as ArchiveAddedEvent } from "../generated/DArchive/DArchive";
import { Archive } from "../generated/schema";

export function handleArchiveAdded(event: ArchiveAddedEvent): void {
  let archive = Archive.load(event.params.ID.toString());

  if (!archive) {
    archive = new Archive(event.params.ID.toString());

    archive.title = event.params.title;
    archive.timestamp = event.params.timestamp;
    archive.contentID = event.params.contentID;
    archive.contentURL = event.params.contentURL;

    archive.save();
  }
}
