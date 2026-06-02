# /new-icon

Adds a new icon alias to the AbIcon registry.

## Usage
```
/new-icon <alias-name> [fa-icon-name-if-different]
```

Example: `/new-icon bell` or `/new-icon sparkles wand-magic-sparkles`

## Steps

Edit `projects/my-lib/src/presentation/shared/ab-icon/ab-icon.registry.ts`:

Add to `AB_ICON_ALIASES`:
```typescript
'<alias-name>': '<fa-icon-suffix>',
```

If alias matches FA name exactly: `'bell': 'bell'`
If alias differs from FA name: `'sparkles': 'wand-magic-sparkles'`

The FA icon suffix is the class name without `fa-` prefix (from Font Awesome Pro 7 Solid).

## Notes
- `AbIconName` type is auto-derived — no type file to update
- The icon must exist in Font Awesome Pro 7 Solid (`fa-solid`)
- In templates: `<ab-icon name="<alias-name>" size="md" />`
- In canvas shapes (JointJS): use SVG path data from theme.ts, not AbIconComponent
