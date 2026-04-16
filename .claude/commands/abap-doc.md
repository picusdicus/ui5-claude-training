---
description: Reads an ABAP object via abap-btp or abap-client-puig MCP and generates a Word document using the corporate template styles
allowed-tools: Read, Write, Bash, mcp__abap-btp__*, mcp__abap-client-puig__*
---

Generate technical documentation for ABAP object: $ARGUMENTS

## Step 1 — Read the source
Use the available ABAP MCP (abap-btp or abap-client-puig) to read the full source code of $ARGUMENTS.
Identify object type automatically: class, function module, report or interface.
If the object is a class, read all methods including private and protected ones.

## Step 2 — Analyze and extract
- Purpose and responsibility (1 paragraph)
- Public methods/functions: name, parameters, types, return values, description
- Protected and private methods: name and brief purpose only
- Dependencies: other classes, function modules, BAPIs called
- Exceptions raised and conditions
- Usage examples derived from the code logic
- Class hierarchy: superclass, interfaces implemented

## Step 3 — Generate Word document with corporate template

Install if needed: npm install -g docx

Create docs/abap/$ARGUMENTS.docx using EXACTLY these corporate styles:

### Page Setup (A4)
Use these exact DXA values:
- Width: 11900, Height: 16840 (A4 portrait)
- Margins: top 2109, right 1552, bottom 2837, left 1276
- Header distance: 709, Footer distance: 709

### Fonts
- Body text: "Ubuntu", 11pt (size: 22 in half-points)
- Headings: "Georgia", bold
- Code blocks: "Courier New", 10pt (size: 20)

### Document Styles
Define these styles in the Document constructor:

styles: {
  default: {
    document: { run: { font: "Ubuntu", size: 22 } }
  },
  paragraphStyles: [
    {
      id: "Heading1", name: "Heading 1",
      basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { font: "Georgia", size: 28, bold: true, color: "FF6353" },
      paragraph: {
        spacing: { before: 480, after: 120 },
        outlineLevel: 0
      }
    },
    {
      id: "Heading2", name: "Heading 2",
      basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { font: "Georgia", size: 28, bold: true, color: "FF6353" },
      paragraph: {
        spacing: { before: 240, after: 0 },
        indent: { left: 360 },
        outlineLevel: 1
      }
    },
    {
      id: "Heading3", name: "Heading 3",
      basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { font: "Georgia", size: 24, bold: true, color: "FF6353" },
      paragraph: {
        spacing: { before: 280, after: 80 },
        outlineLevel: 2
      }
    }
  ]
}

### Cover Page (first section, no header/footer)
Structure:
1. Empty paragraph (spacing)
2. Object name — Georgia 32pt Bold color FF6353
3. Object type + package — Ubuntu 16pt color 666666
4. Generation date — Ubuntu 12pt color 999999
5. Horizontal rule — paragraph bottom border color FF6353 size 6
6. Empty paragraphs (spacing before TOC)

### Document Structure (second section onwards)
1. Cover page (own section, no page number)
2. Table of Contents (HeadingLevel only)
3. Page break
4. Overview (Heading1)
   - Purpose paragraph in Ubuntu 11pt
   - Class hierarchy table: Superclass | Interfaces
5. Public Methods (Heading1)
   - One Heading2 per public method
   - Parameters table: Parameter | Type | Direction | Description
   - Return value if applicable
   - Exceptions raised
6. Protected / Private Methods (Heading1)
   - One Heading2 per method, brief description only
7. Dependencies (Heading1)
   - Bulleted list of classes, function modules, BAPIs used
8. Exceptions (Heading1)
   - Table: Exception Class | Condition / When raised
9. Usage Examples (Heading1)
   - Each example as Heading3 + code paragraph in Courier New 10pt

### Table Style (apply to ALL tables)
- Width: 8800 DXA, type: WidthType.DXA
- columnWidths must sum to 8800
- All borders: BorderStyle.SINGLE, size 1, color "CCCCCC"
- Header row:
  - shading: fill "FF6353", type ShadingType.CLEAR
  - text: color "FFFFFF", bold true, Ubuntu 11pt
- Data rows: alternate fill "F3EDE9" / "FFFFFF", type ShadingType.CLEAR
- Cell margins: top 80, bottom 80, left 120, right 120
- NEVER use WidthType.PERCENTAGE

### Footer (all pages except cover)
- Page number right-aligned
- Style: Ubuntu 7.5pt (size: 15), color 000000
- Use tab stop at position 8504 (right-aligned)

### Critical Rules
- NEVER use \n — use separate Paragraph elements
- NEVER use unicode bullets — use LevelFormat.BULLET with numbering config
- NEVER use WidthType.PERCENTAGE in tables
- ALWAYS set both columnWidths on table AND width on each cell
- ALWAYS use ShadingType.CLEAR, never ShadingType.SOLID
- PageBreak must be inside a Paragraph, never standalone
- TOC requires HeadingLevel styles only

### Output
Save to: docs/abap/$ARGUMENTS.docx

After saving confirm:
- Full file path
- Number of sections generated
- Number of methods documented
- Any objects that could not be read