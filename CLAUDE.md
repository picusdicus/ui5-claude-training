# ui5.claude — Claude Code Context

## Project Overview
Training project to learn Claude Code, built with real production standards.
A master-detail Fiori app for Northwind Products (List → Detail navigation).

## Stack
- SAP UI5 1.146.0 (freestyle, sap.m), theme: sap_horizon
- OData V4: https://services.odata.org/V4/Northwind/Northwind.svc/
- OData model: sap.ui.model.odata.v4.ODataModel
- Fiori Launchpad target, SAP BTP deployment
- JavaScript (no TypeScript), AMD modules (sap.ui.define), "use strict"
- Testing: QUnit (unit) + OPA5 (integration, page object pattern)

## App Architecture
- Namespace: ui5.claude
- Pattern: Master-Detail (ProductList view → ProductDetail view)
- Routing: manifest-first, descriptor-driven
- MVC: XML views + JS controllers, one controller per view
- Models: OData V4 bound in manifest.json, device model in Component.js

## Folder Structure
webapp/
├── controller/     # JS controllers — one per view
├── view/           # XML views
├── model/          # model factories (models.js)
├── i18n/           # i18n.properties — ALL user-facing strings go here
├── css/            # style.css — minimal custom styles only
└── test/
    ├── unit/       # QUnit tests mirroring controller/ structure
    └── integration/# OPA5 journeys + page objects

## Coding Conventions
- 4-space indent, "use strict" in every module
- Namespace mirrors folder: ui5.claude.controller.ProductList
- NEVER hardcode user-facing strings — always use {i18n>key}
- NEVER use sap.ui.commons (deprecated)
- Binding: use $select and $expand explicitly, never bind entire entitysets
- Error handling: always handle OData request failures with MessageBox
- Controllers: keep thin — business logic in model or helper modules
- Routing: always navigate via router, never manipulate URL directly

## OData V4 Specifics
- Model ID: "northwind" (registered in manifest.json)
- Base URL: https://services.odata.org/V4/Northwind/Northwind.svc/
- Key entities: Products, Categories, Suppliers
- Use relative bindings in list, absolute bindings in detail
- Always specify $select to avoid over-fetching
- Paging: use growingThreshold on Lists (default 20)

## NPM Scripts
- Dev server: npm start (fiori run --open)
- Build: npm run build (ui5 build --all)
- Unit tests: npm run test:unit
- Integration tests: npm run test:integration
- All tests: npm test

## What I'm Learning
This project is used to learn Claude Code features progressively:
Week 1: CLAUDE.md, slash commands, skills
Week 2: MCP servers
Week 3: Subagents and Agent Teams
Week 4: Hooks
Week 5: Plugins
Always explain what you're doing and why when making non-obvious decisions.