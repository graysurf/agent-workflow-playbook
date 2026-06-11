# Agent Workflow Playbook

這是一個中文教材網站，用來分享如何把個人 agent 工作流整理成團隊可共用的
skills、hooks、policies、CLI contracts 與多入口工具。

## Local Preview

```bash
npm run build
npm test
npm run serve
```

然後開啟 <http://localhost:4173>。

## GitHub Pages

此 repo 使用 `.github/workflows/pages.yml` 透過 GitHub Actions 發佈 `dist/`
到 GitHub Pages。推送到 `main` 後會自動部署。

## Source Repos Referenced

- <https://github.com/graysurf/agent-runtime-kit>
- <https://github.com/sympoies/nils-cli>
- <https://github.com/sympoies/nils-alfredworkflow>
- <https://github.com/sympoies/symphony-board>
