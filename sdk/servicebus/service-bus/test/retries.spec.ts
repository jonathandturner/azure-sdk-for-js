// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import chai from "chai";
import chaiAsPromised from "chai-as-promised";
chai.use(chaiAsPromised);
const should = chai.should();
import { ReceivedMessageWithLock } from "../src";
import { TestClientType, TestMessage } from "./utils/testUtils";
import { ServiceBusClientForTests, createServiceBusClientForTests } from "./utils/testutils2";
import { ServiceBusSender, ServiceBusSenderImpl } from "../src/sender";
import { MessagingError } from "@azure/core-amqp";
import Long from "long";
import { BatchingReceiver } from "../src/core/batchingReceiver";
import { delay } from "rhea-promise";
import {
  ServiceBusSessionReceiverImpl,
  ServiceBusSessionReceiver
} from "../src/receivers/sessionReceiver";
import { ServiceBusReceiver, ServiceBusReceiverImpl } from "../src/receivers/receiver";

describe("Retries - ManagementClient", () => {
  let sender: ServiceBusSender;
  let receiver:
    | ServiceBusReceiver<ReceivedMessageWithLock>
    | ServiceBusSessionReceiver<ReceivedMessageWithLock>;
  let serviceBusClient: ServiceBusClientForTests;
  const defaultMaxRetries = 2;
  let numberOfTimesManagementClientInvoked: number;

  before(() => {
    serviceBusClient = createServiceBusClientForTests({
      retryOptions: {
        // Defaults
        timeoutInMs: 10000,
        maxRetries: defaultMaxRetries,
        retryDelayInMs: 0
      }
    });
  });

  after(() => {
    return serviceBusClient.test.after();
  });

  async function beforeEachTest(entityType: TestClientType): Promise<void> {
    const entityNames = await serviceBusClient.test.createTestEntities(entityType);

    sender = serviceBusClient.test.addToCleanup(
      serviceBusClient.createSender(entityNames.queue ?? entityNames.topic!)
    );
    receiver = await serviceBusClient.test.getPeekLockReceiver(entityNames);
  }

  async function afterEachTest(): Promise<void> {
    await sender.close();
    await receiver.close();
  }

  function mockManagementClientToThrowError() {
    const fakeFunction = async function() {
      numberOfTimesManagementClientInvoked++;
      throw new MessagingError("Hello there, I'm an error");
    };
    const senderMgmtClient = serviceBusClient["_connectionContext"].getManagementClient(
      sender.entityPath
    );
    const receiverMgmtClient = serviceBusClient["_connectionContext"].getManagementClient(
      receiver.entityPath
    );

    senderMgmtClient["_makeManagementRequest"] = fakeFunction;
    receiverMgmtClient["_makeManagementRequest"] = fakeFunction;
  }

  async function mockManagementClientAndVerifyRetries(func: Function) {
    mockManagementClientToThrowError();
    let errorThrown = false;
    try {
      await func();
    } catch (error) {
      errorThrown = true;
      should.equal(error.message, "Hello there, I'm an error", "Unexpected error thrown");
      should.equal(
        numberOfTimesManagementClientInvoked,
        defaultMaxRetries + 1,
        "Unexpected number of retries"
      );
    }
    should.equal(errorThrown, true, "Error was not thrown");
  }

  describe("Sender Retries", function(): void {
    beforeEach(async () => {
      numberOfTimesManagementClientInvoked = 0;
    });

    afterEach(async () => {
      await afterEachTest();
    });

    it("Unpartitioned Queue: scheduleMessages", async function(): Promise<void> {
      await beforeEachTest(TestClientType.UnpartitionedQueue);
      await mockManagementClientAndVerifyRetries(async () => {
        await sender.scheduleMessages(new Date(), [TestMessage.getSample()]);
      });
    });

    it("Unpartitioned Queue with Sessions: scheduleMessages", async function(): Promise<void> {
      await beforeEachTest(TestClientType.UnpartitionedQueueWithSessions);
      await mockManagementClientAndVerifyRetries(async () => {
        await sender.cancelScheduledMessages([new Long(0)]);
      });
    });
  });

  describe("Receiver Retries", function(): void {
    beforeEach(async () => {
      numberOfTimesManagementClientInvoked = 0;
      await beforeEachTest(TestClientType.UnpartitionedQueue);
    });

    afterEach(async () => {
      await afterEachTest();
    });

    it("Unpartitioned Queue: receiveDeferredMessage", async function(): Promise<void> {
      await mockManagementClientAndVerifyRetries(async () => {
        await receiver.receiveDeferredMessages(new Long(0));
      });
    });

    it("Unpartitioned Queue: peek", async function(): Promise<void> {
      await mockManagementClientAndVerifyRetries(async () => {
        await receiver.peekMessages(1);
      });
    });

    it("Unpartitioned Queue: peekBySequenceNumber", async function(): Promise<void> {
      await mockManagementClientAndVerifyRetries(async () => {
        await receiver.peekMessages(1, { fromSequenceNumber: new Long(0) });
      });
    });
  });

  describe("Session Receiver Retries", () => {
    let sessionReceiver: ServiceBusSessionReceiver<ReceivedMessageWithLock>;
    beforeEach(async () => {
      numberOfTimesManagementClientInvoked = 0;
      await beforeEachTest(TestClientType.UnpartitionedQueueWithSessions);
      sessionReceiver = receiver as ServiceBusSessionReceiver<ReceivedMessageWithLock>;
    });
    afterEach(async () => {
      await afterEachTest();
    });

    it("Unpartitioned Queue with Sessions: peek", async function(): Promise<void> {
      await mockManagementClientAndVerifyRetries(async () => {
        await sessionReceiver.peekMessages(1);
      });
    });

    it("Unpartitioned Queue with Sessions: peekBySequenceNumber", async function(): Promise<void> {
      await mockManagementClientAndVerifyRetries(async () => {
        await sessionReceiver.peekMessages(1, { fromSequenceNumber: new Long(0) });
      });
    });

    it("Unpartitioned Queue with Sessions: receiveDeferredMessage", async function(): Promise<
      void
    > {
      await mockManagementClientAndVerifyRetries(async () => {
        await sessionReceiver.receiveDeferredMessages(new Long(0));
      });
    });

    it("Unpartitioned Queue with Sessions: renewSessionLock", async function(): Promise<void> {
      await mockManagementClientAndVerifyRetries(async () => {
        await sessionReceiver.renewSessionLock();
      });
    });

    it("Unpartitioned Queue with Sessions: setState", async function(): Promise<void> {
      await mockManagementClientAndVerifyRetries(async () => {
        await sessionReceiver.setSessionState("random-state");
      });
    });

    it("Unpartitioned Queue with Sessions: getState", async function(): Promise<void> {
      await mockManagementClientAndVerifyRetries(async () => {
        await sessionReceiver.getSessionState();
      });
    });
  });
});

describe("Retries - MessageSender", () => {
  let sender: ServiceBusSender;
  let serviceBusClient: ServiceBusClientForTests;
  const defaultMaxRetries = 2;
  let numberOfTimesInitInvoked: number;

  before(() => {
    serviceBusClient = createServiceBusClientForTests({
      retryOptions: {
        timeoutInMs: 10000,
        maxRetries: defaultMaxRetries,
        retryDelayInMs: 0
      }
    });
  });

  after(() => {
    return serviceBusClient.test.after();
  });

  async function beforeEachTest(entityType: TestClientType): Promise<void> {
    const entityNames = await serviceBusClient.test.createTestEntities(entityType);

    sender = serviceBusClient.test.addToCleanup(
      serviceBusClient.createSender(entityNames.queue ?? entityNames.topic!)
    );
  }

  async function afterEachTest(): Promise<void> {
    await sender.close();
  }

  function mockInitToThrowError() {
    const fakeFunction = function() {
      numberOfTimesInitInvoked++;
      throw new MessagingError("Hello there, I'm an error");
    };

    (sender as ServiceBusSenderImpl)["_sender"]["isOpen"] = () => false;
    (sender as ServiceBusSenderImpl)["_sender"]["open"] = fakeFunction;
  }

  async function mockInitAndVerifyRetries(func: Function) {
    mockInitToThrowError();
    let errorThrown = false;
    try {
      await func();
    } catch (error) {
      errorThrown = true;
      should.equal(error.message, "Hello there, I'm an error", "Unexpected error thrown");
      should.equal(numberOfTimesInitInvoked, defaultMaxRetries + 1, "Unexpected number of retries");
    }
    should.equal(errorThrown, true, "Error was not thrown");
  }

  beforeEach(async () => {
    numberOfTimesInitInvoked = 0;
  });

  afterEach(async () => {
    await afterEachTest();
  });

  it("Unpartitioned Queue: send", async function(): Promise<void> {
    await beforeEachTest(TestClientType.UnpartitionedQueue);
    await mockInitAndVerifyRetries(async () => {
      await sender.sendMessages(TestMessage.getSample());
    });
  });

  it("Unpartitioned Queue: createBatch", async function(): Promise<void> {
    await beforeEachTest(TestClientType.UnpartitionedQueue);
    await mockInitAndVerifyRetries(async () => {
      await sender.createBatch();
    });
  });

  it("Unpartitioned Queue: sendBatch", async function(): Promise<void> {
    await beforeEachTest(TestClientType.UnpartitionedQueue);
    await mockInitAndVerifyRetries(async () => {
      const batch = await sender.createBatch();
      batch.tryAdd({
        body: "hello"
      });
      await sender.sendMessages(batch);
    });
  });

  it("Unpartitioned Queue with Sessions: send", async function(): Promise<void> {
    await beforeEachTest(TestClientType.UnpartitionedQueue);
    await mockInitAndVerifyRetries(async () => {
      await sender.sendMessages(TestMessage.getSample());
    });
  });

  it("Unpartitioned Queue with Sessions: createBatch", async function(): Promise<void> {
    await beforeEachTest(TestClientType.UnpartitionedQueue);
    await mockInitAndVerifyRetries(async () => {
      await sender.createBatch();
    });
  });

  it("Unpartitioned Queue with Sessions: sendBatch", async function(): Promise<void> {
    await beforeEachTest(TestClientType.UnpartitionedQueue);
    await mockInitAndVerifyRetries(async () => {
      const batch = await sender.createBatch();
      batch.tryAdd({
        body: "hello"
      });
      await sender.sendMessages(batch);
    });
  });
});

describe("Retries - Receive methods", () => {
  let receiver: ServiceBusReceiver<ReceivedMessageWithLock>;
  let serviceBusClient: ServiceBusClientForTests;
  const defaultMaxRetries = 2;
  let numberOfTimesTried: number;

  before(() => {
    serviceBusClient = createServiceBusClientForTests({
      retryOptions: {
        // Defaults
        timeoutInMs: 10000,
        maxRetries: defaultMaxRetries,
        retryDelayInMs: 0
      }
    });
  });

  after(() => {
    return serviceBusClient.test.after();
  });

  async function beforeEachTest(entityType: TestClientType): Promise<void> {
    const entityNames = await serviceBusClient.test.createTestEntities(entityType);
    receiver = await serviceBusClient.test.getPeekLockReceiver(entityNames);
  }

  async function afterEachTest(): Promise<void> {
    await receiver.close();
  }

  function mockBatchingReceiveToThrowError() {
    const fakeFunction = async function() {
      numberOfTimesTried++;
      throw new MessagingError("Hello there, I'm an error");
    };

    if (receiver instanceof ServiceBusSessionReceiverImpl) {
      // Mocking `_messageSession.receiveMessages()` to throw the error and fail
      (receiver as ServiceBusSessionReceiverImpl<ReceivedMessageWithLock>)[
        "_messageSession"
      ].receiveMessages = fakeFunction;
    } else {
      // Mocking batchingReceiver.receive to throw the error and fail
      const batchingReceiver = BatchingReceiver.create(
        (receiver as any)._context,
        "dummyEntityPath"
      );
      batchingReceiver.isOpen = () => true;
      batchingReceiver.receive = fakeFunction;
      (receiver as ServiceBusReceiverImpl<ReceivedMessageWithLock>)[
        "_batchingReceiver"
      ] = batchingReceiver;
    }
  }

  async function mockReceiveAndVerifyRetries(func: Function) {
    mockBatchingReceiveToThrowError();
    let errorThrown = false;
    try {
      await func();
    } catch (error) {
      errorThrown = true;
      should.equal(error.message, "Hello there, I'm an error", "Unexpected error thrown");
      should.equal(numberOfTimesTried, defaultMaxRetries + 1, "Unexpected number of retries");
    }
    should.equal(errorThrown, true, "Error was not thrown");
  }

  beforeEach(async () => {
    numberOfTimesTried = 0;
  });

  afterEach(async () => {
    await afterEachTest();
  });

  it("Unpartitioned Queue: receiveBatch", async function(): Promise<void> {
    await beforeEachTest(TestClientType.UnpartitionedQueue);
    await mockReceiveAndVerifyRetries(async () => {
      await receiver.receiveMessages(1);
    });
  });

  it("Unpartitioned Queue with Sessions: receiveBatch", async function(): Promise<void> {
    await beforeEachTest(TestClientType.UnpartitionedQueueWithSessions);
    await mockReceiveAndVerifyRetries(async () => {
      await receiver.receiveMessages(1);
    });
  });

  it("Unpartitioned Queue: MessageIterator", async function(): Promise<void> {
    await beforeEachTest(TestClientType.UnpartitionedQueue);
    await mockReceiveAndVerifyRetries(async () => {
      await receiver.getMessageIterator().next();
    });
  });

  it("Unpartitioned Queue with Sessions: MessageIterator", async function(): Promise<void> {
    await beforeEachTest(TestClientType.UnpartitionedQueueWithSessions);
    await mockReceiveAndVerifyRetries(async () => {
      await receiver.getMessageIterator().next();
    });
  });
});

describe("Retries - onDetached", () => {
  let sender: ServiceBusSender;
  let receiver:
    | ServiceBusReceiver<ReceivedMessageWithLock>
    | ServiceBusSessionReceiver<ReceivedMessageWithLock>;
  let serviceBusClient: ServiceBusClientForTests;
  const defaultMaxRetries = 2;
  let numberOfTimesOnDetachedInvoked: number;

  before(() => {
    serviceBusClient = createServiceBusClientForTests({
      retryOptions: {
        // Defaults
        timeoutInMs: 10000,
        maxRetries: defaultMaxRetries,
        retryDelayInMs: 0
      }
    });
  });

  after(() => {
    return serviceBusClient.test.after();
  });

  async function beforeEachTest(entityType: TestClientType): Promise<void> {
    const entityNames = await serviceBusClient.test.createTestEntities(entityType);

    sender = serviceBusClient.test.addToCleanup(
      serviceBusClient.createSender(entityNames.queue ?? entityNames.topic!)
    );
    receiver = await serviceBusClient.test.getPeekLockReceiver(entityNames);
  }

  async function afterEachTest(): Promise<void> {
    await sender.close();
    await receiver.close();
  }

  const fakeFunction = async function() {
    numberOfTimesOnDetachedInvoked++;
    throw new MessagingError("Hello there, I'm an error");
  };

  async function mockOnDetachedAndVerifyRetries(func: Function) {
    await func();
    // Cannot verify the error thrown because onDetached logs the error and doesn't throw
    should.equal(
      numberOfTimesOnDetachedInvoked,
      defaultMaxRetries + 1,
      "Unexpected number of retries"
    );
  }

  beforeEach(async () => {
    numberOfTimesOnDetachedInvoked = 0;
  });

  afterEach(async () => {
    await afterEachTest();
  });

  it("Unpartitioned Queue: streaming", async function(): Promise<void> {
    await beforeEachTest(TestClientType.UnpartitionedQueue);
    await mockOnDetachedAndVerifyRetries(async () => {
      receiver.subscribe({
        async processMessage() {},
        async processError() {}
      });
      await delay(2000);

      const streamingReceiver = (receiver as ServiceBusReceiverImpl<any>)["_streamingReceiver"]!;
      should.exist(streamingReceiver);

      streamingReceiver["init"] = fakeFunction;
      await streamingReceiver.onDetached(new MessagingError("Hello there, I'm an error"));
    });
  });

  it("Unpartitioned Queue: sender", async function(): Promise<void> {
    await beforeEachTest(TestClientType.UnpartitionedQueue);
    await mockOnDetachedAndVerifyRetries(async () => {
      (sender as ServiceBusSenderImpl)["_sender"]["open"] = fakeFunction;

      await (sender as ServiceBusSenderImpl)["_sender"].onDetached(
        new MessagingError("Hello there, I'm an error")
      );
    });
  });
});
