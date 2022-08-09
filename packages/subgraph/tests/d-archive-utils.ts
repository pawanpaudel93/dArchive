import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt } from "@graphprotocol/graph-ts"
import { ArchiveAdded } from "../generated/DArchive/DArchive"

export function createArchiveAddedEvent(
  ID: BigInt,
  contentID: string,
  contentURI: string,
  title: string,
  timestamp: BigInt
): ArchiveAdded {
  let archiveAddedEvent = changetype<ArchiveAdded>(newMockEvent())

  archiveAddedEvent.parameters = new Array()

  archiveAddedEvent.parameters.push(
    new ethereum.EventParam("ID", ethereum.Value.fromUnsignedBigInt(ID))
  )
  archiveAddedEvent.parameters.push(
    new ethereum.EventParam("contentID", ethereum.Value.fromString(contentID))
  )
  archiveAddedEvent.parameters.push(
    new ethereum.EventParam("contentURI", ethereum.Value.fromString(contentURI))
  )
  archiveAddedEvent.parameters.push(
    new ethereum.EventParam("title", ethereum.Value.fromString(title))
  )
  archiveAddedEvent.parameters.push(
    new ethereum.EventParam(
      "timestamp",
      ethereum.Value.fromUnsignedBigInt(timestamp)
    )
  )

  return archiveAddedEvent
}
