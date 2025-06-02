# Change Log

## 0.18.4

### Patch Changes

- d7027da: Release v0.18.4: Complete dependency modernization and code quality improvements

  This release completes a comprehensive dependency modernization effort across all packages:

  **Dependency Updates:**

  - Updated testcontainers from v9 to v11 with breaking API changes
  - Updated ulid from v2 to v3
  - Updated @middy packages from v4 to v6
  - Updated commander from v10 to v14
  - Updated all AWS SDK packages to v3.821.0
  - Updated Effect ecosystem packages to latest versions

  **Infrastructure Improvements:**

  - Implemented centralized dependency management via pnpm catalog system
  - Removed deprecated packages: @aws-sdk/smithy-client, @aws-sdk/service-error-classification, @effect/schema
  - Added mise task for clean rebuilds
  - Resolved all ESLint warnings about `any` types

  **Code Quality:**

  - Replaced deprecated AWS SDK error classification with local functions
  - Improved TypeScript typing throughout dynamo-event-store package
  - Added proper error type interfaces and type guards
  - Fixed exactOptionalPropertyTypes compatibility issues

  **Testing:**

  - All 75+ tests continue to pass
  - Updated test code to work with new API versions
  - Maintained backward compatibility where possible

  This release represents a significant modernization effort while maintaining full functionality and test coverage.

- Updated dependencies [d7027da]
  - @weegigs/events-core@0.18.4
  - @weegigs/dynamo-event-store@0.18.4

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.18.3](https://github.com/weegigs/wee-events/compare/v0.18.2...v0.18.3) (2023-03-05)

**Note:** Version bump only for package @weegigs/events-tools

## [0.18.2](https://github.com/weegigs/wee-events/compare/v0.18.1...v0.18.2) (2023-03-05)

**Note:** Version bump only for package @weegigs/events-tools

## [0.18.1](https://github.com/weegigs/wee-events/compare/v0.18.0...v0.18.1) (2023-03-05)

**Note:** Version bump only for package @weegigs/events-tools

# 0.18.0 (2023-02-24)

### Bug Fixes

- correct depenencies ([97dfaab](https://github.com/weegigs/wee-events/commit/97dfaab70f4863b71b190f6be68bc75e72618803))
- switch references from @weegigs/wee-events to @weegigs/events-core ([f3b5225](https://github.com/weegigs/wee-events/commit/f3b522550cc0f7f11a967893d6be61c716e08d4e))

### Features

- basic cli ([025435f](https://github.com/weegigs/wee-events/commit/025435fe7762f68df1b0b54ac0c5786dd90e97c7))
- effects based service definition ([59fbe04](https://github.com/weegigs/wee-events/commit/59fbe0433839f220f5f9cc5aa43d0dc78e7c0c19))
