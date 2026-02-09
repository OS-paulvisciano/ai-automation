# TODO - Future Enhancements

## Figma Code Connect Integration

**Priority**: Medium  
**Status**: Not Started  
**Reference**: [Code Connect Documentation](https://developers.figma.com/docs/code-connect/code-connect-ui-setup/)

### Description
Implement Figma Code Connect to map design components to actual code components. This will provide AI agents with direct references to code implementations, improving design-to-code accuracy.

### Benefits
- More accurate AI code generation from Figma designs
- Direct mapping between Figma components and code components
- Better context for AI when implementing designs
- Reduced manual verification needed

### Implementation Steps
1. Set up Code Connect UI in Figma Dev Mode
2. Create mappings for key components (Card, Button, etc.)
3. Add Code Connect configuration to project configs
4. Update design verification skill to use Code Connect mappings
5. Document usage in skills/design-verification.md

### Resources
- [Code Connect UI Setup](https://developers.figma.com/docs/code-connect/code-connect-ui-setup/)
- [Code Connect Integration Guide](https://developers.figma.com/docs/figma-mcp-server/code-connect-integration/)
- [Figma MCP Tools and Prompts](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/)

### Related Files
- `skills/design-verification.md` - Will need updates to use Code Connect
- `projects/runtime-mobile-widgets/config.json` - May need Code Connect mappings
- `infrastructure/mcp-servers/figma.json` - May need Code Connect configuration
