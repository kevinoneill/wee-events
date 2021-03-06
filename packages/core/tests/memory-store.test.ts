import { Subscription, pipe } from "rxjs";
import { take as rtake, toArray } from "rxjs/operators";

import { subscribe, MemoryEventStore } from "../src/event-store";
import { PublishedEvent, eventPublishedAt, EventStreamOptions, eventId } from "../src";

describe("creating a memory store", () => {
  it("can be created", () => {
    const store = new MemoryEventStore();

    expect(store).toBeDefined();
  });
});

const testOne = testId("1");

describe("publishing events", () => {
  let store: MemoryEventStore;

  beforeEach(() => {
    store = new MemoryEventStore();
  });

  it("can publish events", async () => {
    const [published] = await store.publish({ type: "test", aggregateId: testOne });
    const events = await store.snapshot(testOne);

    expect(published).toBeDefined();
    expect(events).toHaveLength(1);

    const event = events[0];
    expect(event).toEqual(published);
    expect(event.key).toBeUndefined();
    expect(eventPublishedAt(event)).toBeDefined();
    expect(event.aggregateId).toEqual(testOne);
  });
});

describe("streaming events", () => {
  let store: MemoryEventStore;
  let subscription: Subscription;

  let take1 = take(store, 1);
  let take2 = take(store, 3);
  let take3 = take(store, 3);

  beforeEach(() => {
    store = new MemoryEventStore();
    take1 = take(store, 1);
    take2 = take(store, 2);
    take3 = take(store, 3);
  });

  afterEach(done => {
    store = null;
    if (subscription) {
      subscription.unsubscribe();
      subscription = null;
    }

    done();
  });

  it("can be subscribed to", async () => {
    let events: any[] = [];
    const subscription = subscribe(store, async e => {
      events.push(e);
    });

    expect(subscription).toBeDefined();
  });

  it("broadcasts newly published events", async () => {
    const next: Promise<PublishedEvent> = new Promise((resolve, reject) => {
      subscription = take1(e => resolve(e[0]));
    });

    const [published] = await store.publish({ type: "test", aggregateId: testOne });
    const event = await next;

    expect(event).toBeDefined();
    expect(event).toEqual(published);
  });

  it("broadcasts existing events", async () => {
    const [published] = await store.publish({ type: "test", aggregateId: testOne });

    const next: Promise<PublishedEvent> = new Promise((resolve, reject) => {
      subscription = take1(e => resolve(e[0]));
    });
    const event = await next;

    expect(event).toBeDefined();
    expect(event).toBe(published);
  });

  it("broadcasts existing and new events", async () => {
    const [first] = await store.publish({ type: "test", aggregateId: testOne });
    const publications: Promise<PublishedEvent[]> = new Promise((resolve, reject) => {
      subscription = store
        .stream()
        .pipe(
          rtake(2),
          toArray()
        )
        .subscribe(e => resolve(e));
    });
    const [second] = await store.publish({ type: "test", aggregateId: testId("2") });

    const events = await publications;

    expect(events).toBeDefined();
    expect(events).toHaveLength(2);
    expect(events[0]).toEqual(first);
    expect(events[1]).toEqual(second);
  });

  it("broadcasts after specified event", async () => {
    const [before] = await store.publish({ type: "test", aggregateId: testOne });
    const [after] = await store.publish({ type: "test", aggregateId: testId("2") });

    const second: Promise<PublishedEvent> = new Promise((resolve, reject) => {
      subscription = subscribe(store, async e => resolve(e), { after: eventId(before) });
    });

    const event = await second;

    expect(event).toBeDefined();
    expect(event).toEqual(after);
  });
});

function take(store: MemoryEventStore, count: number) {
  return (subscription: (value: any) => void, options: EventStreamOptions = {}) => {
    return store
      .stream(options)
      .pipe(
        rtake(count),
        toArray()
      )
      .subscribe(subscription);
  };
}

function testId(key: string = "1", type: string = "test") {
  return { id: key, type };
}
