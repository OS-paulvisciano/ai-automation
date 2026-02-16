# Contributing

Thank you for contributing to the AI Automation Framework!

## How to Contribute

### Adding New Skills

1. Create `.cursor/skills/shared/{skill-name}/SKILL.md` (directory + SKILL.md with YAML frontmatter)
2. Follow the structure of existing skills:
   - Metadata (ID, version, dependencies, MCPs)
   - Rules and conventions
   - Validation criteria
   - Examples
   - AI instructions
3. Update `.cursor/skills/shared/README.md`
4. Submit a pull request

### Adding New Agents

**For Orchestrator Agents** (automation repo):
1. Create `.cursor/agents/{agent-name}.md` in automation repo
2. Define workflow steps
3. List required skills
4. Document configuration options

**For Repository-Specific Agents**:
1. Create `.cursor/agents/{agent-name}.md` in target repository
2. Define workflow steps
3. List required skills (shared and repo-specific)
4. Document configuration options
6. Submit a pull request

### Adding MCP Servers

1. Create `infrastructure/mcp-servers/{server-name}.json`
2. Document capabilities and setup
3. Update `infrastructure/README.md`
4. Add to `infrastructure/mcp-config.json` example
5. Submit a pull request

### Team/Project Configurations

1. Create team/project directory
2. Add `config.json` with settings
3. Document any overrides
4. Update relevant README files
5. Submit a pull request

## Pull Request Process

1. Create a branch: `feature/your-feature-name`
2. Make your changes
3. Update documentation
4. Test your changes
5. Submit PR with clear description

## Code of Conduct

- Be respectful and inclusive
- Focus on improving the framework
- Document your changes clearly
- Help others understand your contributions
