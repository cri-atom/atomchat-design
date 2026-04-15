# Atom AgentBuilder

Angular library workspace for @atom/agentbuilder.

This repository contains:
- A reusable Angular library (projects/my-lib) with the Agent Builder product.
- A standalone development host app (projects/dev-app) to run and validate the library in isolation.

## Table of contents

1. What this project is
2. Tech stack
3. Code walkthrough (high-level)
4. Repository structure
5. Prerequisites
6. Setup
7. Run modes (3 ways to run/integrate)
8. Testing and quality
9. Build artifacts
10. Troubleshooting

## 1. What this project is

Atom AgentBuilder is a visual flow editor for AI agent orchestration.

Main capabilities:
- Node-based flow design (Start, Agent, Tool, End, SelectAgent).
- Conditional edge configuration.
- Inspector-driven node and edge editing.
- Global flow settings (pipeline, stages, save fields, timezone, safeguards).
- Integration ports for host services (auth, state persistence, chat, composio tools, app config).

## 2. Tech stack

- Angular 20 (standalone components + OnPush).
- RxJS and Angular Signals.
- JointJS/Rappid for canvas rendering and interactions.
- Angular Material for form controls and UI primitives.
- Transloco for i18n.
- Karma + Jasmine for component tests.

## 3. Code walkthrough (high-level)

### Presentation layer

- Root shell: AtomAgentBuilderComponent.
- Canvas: editor component under presentation/canvas/editor.
- Inspector: container, views, tabs, and modals under presentation/inspector.

### State and orchestration

- FlowAgentInternalStateService:
  - Central BehaviorSubject state for nodes, edges, selection, and global settings.
  - CRUD operations for nodes, edges, tools, KBs, and form-driven data.
- FlowAgentActionsService:
  - Load/save orchestration and unsaved-changes tracking.
- FlowAgentValidationService:
  - Validation rules for graph consistency and required node/edge data.
- FlowAgentDefaultsService:
  - Default data factories and positioning helpers for new nodes/edges.

### Contracts and integrations

The library exposes abstract host service contracts (ports) such as:
- AuthService
- FlowAgentStateService
- AgentChatService
- ComposioToolService
- AppConfigService

The module supports override injection via AtomAgentBuilderModule.forRoot(...) and also ships default implementations.

### Public API

Entry point: projects/my-lib/public-api.ts

Exports include:
- AtomAgentBuilderComponent and AtomAgentBuilderModule
- Domain models and types
- Abstract service contracts
- Default service implementations
- Config types

## 4. Repository structure

- projects/my-lib:
  - Library source code and assets.
- projects/dev-app:
  - Standalone host app used for local development and visual/manual validation.
- scripts/publish.js:
  - Builds the library and packs a distributable tgz.
- scripts/watch.js:
  - Continuous library build for real-time host integration.
- dist:
  - Build output and package artifacts.

## 5. Prerequisites

- Node.js 20.x (required by package engines).
- npm.
- Chrome/ChromeHeadless available for tests.

## 6. Setup

From repo root:

npm install

## 7. Run modes (3 ways to run/integrate)

## Mode A: Standalone server (local dev app)

Use this when you want to develop the builder in isolation.

From this repo root:

npm run serve

What it does:
- Runs ng serve dev-app --open.
- Boots projects/dev-app and renders AtomAgentBuilderComponent standalone.

## Mode B: Integrated into Atom after packaged build (stable handoff)

Use this for packaged integration into the Atom host.

Step 1. Build and package from this repo:

npm run publish

What it does:
- Builds my-lib.
- Copies local tgz dependencies into dist/atom-agentbuilder/lib-deps.
- Generates dist/atom-agentbuilder.tgz.

Step 2. Copy artifact to Atom repo:
- Copy dist/atom-agentbuilder.tgz to c:/dev/atom/lib-deps/atom-agentbuilder.tgz.

Step 3. In c:/dev/atom, install packaged libraries:

npm run update-libraries

Step 4. Run Atom:

npm run start:atom

(Or use npm run start depending on your target config.)

## Mode C: Integrated into Atom in real time (watch)

Use this for fast iteration while coding AgentBuilder and validating directly inside Atom.

Terminal 1 (this repo, c:/dev/atom-agentbuilder):

npm run watch

What it does:
- Runs ng build my-lib --watch --configuration development.
- Keeps dist/atom-agentbuilder updated continuously.
- Ensures dist/atom-agentbuilder/lib-deps is linked/copied for postinstall resolution.

Terminal 2 (Atom repo, c:/dev/atom):

npm i @atom/agentbuilder@file:../atom-agentbuilder/dist/atom-agentbuilder --force
npm run start:atom

Notes:
- Keep npm run watch running while working.
- If you want to switch back to packaged tgz flow, run npm run update-libraries in atom.

## 8. Testing and quality

Run unit/component tests (library + dev-app test bundle):

npm test -- --watch=false --browsers=ChromeHeadless

Formatting:

npm run format
npm run format:check

## 9. Build artifacts

Main outputs under dist:
- dist/atom-agentbuilder (folder package, used by watch-based integration).
- dist/atom-agentbuilder.tgz (packed artifact, used by stable packaged integration).

## 10. Troubleshooting

- If Atom does not pick latest watch changes:
  - Ensure npm run watch is active.
  - Re-run npm i @atom/agentbuilder@file:../atom-agentbuilder/dist/atom-agentbuilder --force in atom.
- If peer dependency or local tgz resolution fails:
  - Check dist/atom-agentbuilder/lib-deps 
