### BDD behaviour driven development

Describe behaviour. With a declarative style, each step communicates an idea:
The intent of the scenario remains the same, even if the implementation changes later.
In addition, having too many implementation details in a scenario, makes it harder to understand the intended behaviour it illustrates.

## Gherkin

Feature: Subscribers see different articles based on their subscription level

Scenario: Free subscribers see only the free articles
Given Free Frieda has a free subscription
When Free Frieda logs in with her valid credentials
Then she sees a Free article

Scenario: Subscriber with a paid subscription can access both free and paid articles
Given Paid Patty has a basic-level paid subscription
When Paid Patty logs in with her valid credentials
Then she sees a Free article and a Paid article

## Cucumber

```bash
pnpm add --save-dev @cucumber/cucumber
```

## User Story

Should have testable acceptance criterias
Should be: Independent - Negotiable - Valuable - Estimatible - Small - Testable
Answer these questions: Who What Why

## stubs

We want most of our tests to use some kind of in-memory stub implementation, instead of an actual database.
Much faster

```javascript
const { ScoreService } = require("../src/domain/scoreService");

test("ScoreService calculates the score using a stub", async () => {
  // Stub: deterministic data
  const userRepositoryStub = {
    getUser: jest.fn().mockResolvedValue({ id: 1, name: "Alice" })
  };

  const service = new ScoreService(userRepositoryStub);

  const result = await service.calculate(1);

  expect(result).toBe(50); // 5 * 10

  // IMPORTANT: no behaviour expectation
  // We do NOT assert how many times getUser was called
});
```

## Mock

```javascript
const { ScoreService } = require("../src/domain/scoreService");

test("ScoreService calls repository correctly (mock)", async () => {
  // Mock: we will ASSERT how it is used
  const userRepositoryMock = {
    getUser: jest.fn().mockResolvedValue({ id: 1, name: "Alice" })
  };

  const service = new ScoreService(userRepositoryMock);

  await service.calculate(1);

  // Behavior verification
  expect(userRepositoryMock.getUser).toHaveBeenCalledTimes(1);
  expect(userRepositoryMock.getUser).toHaveBeenCalledWith(1);
});
```

# Hexagonal (Ports & Adapters) Starter — JavaScript + Jest

This small starter demonstrates:

- Domain layer with ports (interfaces)
- Adapters (in-memory and console)
- Tests showing **Stub** (state-based) and **Mock** (interaction-based) using Jest

---

## Project layout

```
package.json
jest.config.js
README.md
src/
  domain/
    ports.js
    scoreService.js
  adapters/
    userRepoInMemory.js
    scorePublisherConsole.js
tests/
  scoreService.stub.test.js
  scoreService.mock.test.js
```

---

## package.json

```json
{
  "name": "hexagonal-jest-starter",
  "version": "1.0.0",
  "type": "commonjs",
  "scripts": {
    "test": "jest --runInBand"
  },
  "devDependencies": {
    "jest": "^29.0.0"
  }
}
```

---

## jest.config.js

```js
module.exports = {
  testEnvironment: "node"
};
```

---

## src/domain/ports.js

```js
class UserRepositoryPort {
  async getUser(userId) {
    throw new Error("Not implemented");
  }
}

class ScorePublisherPort {
  async publish(userId, score) {
    throw new Error("Not implemented");
  }
}

module.exports = { UserRepositoryPort, ScorePublisherPort };
```

---

## src/domain/scoreService.js

```js
class ScoreService {
  constructor(userRepository, scorePublisher) {
    this.userRepository = userRepository;
    this.scorePublisher = scorePublisher;
  }

  async calculate(userId) {
    const user = await this.userRepository.getUser(userId);
    const score = user.name.length * 10;
    await this.scorePublisher.publish(userId, score);
    return score;
  }
}

module.exports = { ScoreService };
```

---

## src/adapters/userRepoInMemory.js

```js
// simple adapter used only for manual runs / demos
class UserRepoInMemory {
  constructor() {
    this.users = new Map();
    this.users.set(1, { id: 1, name: "Alice" });
    this.users.set(2, { id: 2, name: "Bob" });
  }

  async getUser(userId) {
    return this.users.get(userId) || null;
  }
}

module.exports = { UserRepoInMemory };
```

---

## src/adapters/scorePublisherConsole.js

```js
class ScorePublisherConsole {
  async publish(userId, score) {
    console.log(`Published score for ${userId}: ${score}`);
  }
}

module.exports = { ScorePublisherConsole };
```

---

## tests/scoreService.stub.test.js

```js
const { ScoreService } = require("../src/domain/scoreService");

test("calculate uses stubbed repo and returns expected score (state-based)", async () => {
  // Stub: deterministic return value
  const userRepositoryStub = {
    getUser: jest.fn().mockResolvedValue({ id: 1, name: "Alice" })
  };

  // Publisher can be a noop (we're not asserting interactions)
  const noopPublisher = { publish: async () => {} };

  const service = new ScoreService(userRepositoryStub, noopPublisher);

  const score = await service.calculate(1);

  expect(score).toBe(50);

  // NOTE: no expectations on userRepositoryStub.getUser calls — this is a stub test
});
```

---

## tests/scoreService.mock.test.js

```js
const { ScoreService } = require("../src/domain/scoreService");

test("calculate calls repository and publisher correctly (interaction-based)", async () => {
  const userRepositoryMock = {
    getUser: jest.fn().mockResolvedValue({ id: 2, name: "Bob" })
  };

  const publisherMock = {
    publish: jest.fn().mockResolvedValue(undefined)
  };

  const service = new ScoreService(userRepositoryMock, publisherMock);

  const score = await service.calculate(2);

  // state assertion
  expect(score).toBe(30); // 'Bob' length = 3 -> 3*10 = 30

  // interaction assertions — this is what makes it a mock test
  expect(userRepositoryMock.getUser).toHaveBeenCalledTimes(1);
  expect(userRepositoryMock.getUser).toHaveBeenCalledWith(2);

  expect(publisherMock.publish).toHaveBeenCalledTimes(1);
  expect(publisherMock.publish).toHaveBeenCalledWith(2, 30);
});
```

---

## README.md (usage)

````md
# Hexagonal Jest Starter

Run:

```bash
npm install
npm test
```
````

What's included:

- Domain layer with ports in `src/domain`
- Simple adapters in `src/adapters` (not used by tests)
- Two tests showing stub vs mock behavior

How to extend:

- Add TypeScript types
- Replace in-memory adapter with DB adapter
- Add integration tests for adapters
