import { PublishedEvent, AggregateId } from "@weegigs/events-core";
import { Collection } from "mongodb";

import { DocumentProjectionFunction, DocumentProjectionOptions } from "../types";

import { MongoProjection } from "./mongo-projection";
import { ProjectionDocument, ProjectionMetadata } from "./types";
import { findProjectionMetadata } from "./utilities";

export class MongoDocumentProjection<T> extends MongoProjection {
  private collection: Collection<ProjectionDocument<T>>;

  constructor(
    collection: Collection<ProjectionDocument<T>>,
    metadata: ProjectionMetadata,
    projection: DocumentProjectionFunction<T>,
    options: DocumentProjectionOptions = {}
  ) {
    const { type, preload } = {
      preload: false,
      ...options,
    } as DocumentProjectionOptions;

    const documentProjection = async (event: PublishedEvent): Promise<void> => {
      const { aggregateId: id } = event;
      if (type === undefined || type === id.type) {
        const current = preload ? await this.get(id) : undefined;
        const data = await projection(event, current);
        if (data) {
          await this.updateProjection(event, data);
        } else {
          await this.deleteProjection(event.aggregateId);
        }
      }
    };

    super(collection as any, metadata, documentProjection, options);
    this.collection = collection;
  }

  async get(id: AggregateId): Promise<T | undefined> {
    const document = await this.getProjection(id);
    return document === undefined ? undefined : document.content;
  }

  private async updateProjection(event: PublishedEvent, content: T) {
    return this.collection.update(
      aggregateFilter(event.aggregateId),
      { id: event.aggregateId, version: event.id, content },
      { upsert: true }
    );
  }

  private async deleteProjection(id: AggregateId) {
    return this.collection.deleteOne(aggregateFilter(id));
  }

  private async getProjection(id: AggregateId): Promise<ProjectionDocument<T> | undefined> {
    const document = await this.collection.findOne(aggregateFilter(id));
    return document === null ? undefined : document;
  }
}

export async function createDocumentProjection<T>(
  collection: Collection<ProjectionDocument<T>>,
  name: string,
  projection: DocumentProjectionFunction<T>,
  options: DocumentProjectionOptions = {}
) {
  const metadata = await findProjectionMetadata(collection as any, name);
  return new MongoDocumentProjection<T>(collection, metadata, projection, options);
}

function aggregateFilter(id: AggregateId) {
  return { "id.id": id.id, "id.type": id.type };
}
