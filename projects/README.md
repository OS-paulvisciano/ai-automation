# Projects

Project-specific configurations and overrides.

## Purpose

Projects can have specific configurations (Figma file keys, Jira projects, etc.). **Note:** The `projects/` folder is automation-repo-only and is used by setup scripts. Individual repos access the shared framework via `.cursor/shared` symlink, which does not include project overrides.

## Structure

```
projects/
├── {project-name}/
│   ├── skills/          # Project-specific skill overrides
│   ├── agents/          # Project-specific agent overrides
│   └── config.json      # Project configuration
```

## Available Projects

- **`runtime-mobile-widgets`** - Runtime Mobile Widgets JS project
- **`widget-library`** - OutSystems Widget Library for Mobile UI components

## Setting Up a Project

Use the setup script to clone and configure a project:

```bash
node scripts/setup-project.js <project-name>
```

The setup script will:
1. Clone the project repository (or use existing if present)
2. Symlink the automation framework into `.cursor/shared`
3. Run project-specific setup steps (npm authentication, etc.)

**Example:**
```bash
node scripts/setup-project.js widget-library
```

This will:
- Clone `OutSystems/OutSystems.WidgetLibrary` to `~/repos/OutSystems.WidgetLibrary`
- Create `.cursor/shared` symlink pointing to `~/repos/ai-automation/.cursor/shared`
- Set up npm authentication using `AZURE_DEVOPS_PAT` from `.env`
- Configure `.npmrc` files

**Note:** Make sure you have `AZURE_DEVOPS_PAT` set in the automation repo's `.env` file before running setup.

## Project Configuration

Each project can define:
- **Figma Settings**: File keys, design system info
- **Jira Settings**: Project keys, workflows
- **GitHub Settings**: Repo-specific conventions
- **Build Settings**: Test commands, build scripts

## Adding Project Config

1. Create `projects/{project-name}/` directory
2. Create `config.json` with project settings
3. Add skill/agent overrides if needed
4. Document project-specific conventions

## Example: Runtime Mobile Widgets

See `runtime-mobile-widgets/config.json` for project-specific settings.

## Widget Library Complete Workflow

The complete workflow for setting up WidgetLibrary and preparing a XIF file:

### 1. Initial Setup (One-time)

```bash
# From the ai-automation repo
node scripts/setup-project.js widget-library
```

This automates:
- ✅ Clone the repository (or use existing)
- ✅ Setup symlink to automation framework (`.cursor/shared`)
- ✅ Setup npm authentication (prompts for Azure DevOps PAT if missing)
- ✅ Configure `.npmrc` files

### 2. Install Dependencies

```bash
cd ~/repos/OutSystems.WidgetLibrary/ServiceStudio
npm install
```

### 3. Update Runtime Widgets

Get the latest changes from the runtime-mobile-widgets-js repo:

```bash
npm run update-runtime-widgets
```

This:
- Updates `@outsystems/runtime-mobile-widgets-js` to the latest version
- Copies runtime and design-time resources to the WidgetLibrary

### 4. Prepare XIF

Run the automated XIF preparation script:

```bash
npm run prepare-xif
```

Or directly:
```bash
node scripts/prepare_xif.js
```

This script:
- ✅ Pulls latest changes from `dev` branch
- ✅ Prompts for latest published version (from Slack)
- ✅ Bumps version in `Widgets.xml` and `AssemblyInfo.cs`
- ✅ Restores NuGet packages (via `dotnet clean`)
- ✅ Builds the solution (generates XIF file)
- ✅ Copies XIF to ODC Studio Plugins folder
- ✅ Removes older XIF versions
- ✅ Guides through Slack notification and ODC publishing

**Note:** The script handles interrupt signals (Ctrl+C) properly, so you can safely cancel long-running operations.

### Summary

Complete workflow from clone to XIF:
1. **Clone & Setup**: `node scripts/setup-project.js widget-library`
2. **Install**: `cd ServiceStudio && npm install`
3. **Update Runtime**: `npm run update-runtime-widgets`
4. **Prepare XIF**: `npm run prepare-xif`

The `prepare-xif` script handles NuGet restore, build, and XIF creation automatically.
