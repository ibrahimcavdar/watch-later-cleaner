# Contributing

Contributions that keep the extension focused, understandable, and permission-minimal are welcome.

## Local workflow

1. Create a branch from `master`.
2. Load the repository as an unpacked extension in Brave or Chrome.
3. Test changes on `https://www.youtube.com/playlist?list=WL` with a disposable Watch Later item.
4. Run `./scripts/validate-extension.sh`.
5. Describe the behavior change and manual test coverage in the pull request.

## Guidelines

- Keep all executable logic in the repository and extension package.
- Do not add remote scripts, analytics, tracking, or unrelated host access.
- Request no new browser permission without a concrete feature requirement.
- Preserve optimistic rollback behavior for operations that modify a playlist.
- Update `PRIVACY.md` and `docs/STORE_LISTING.md` when data handling changes.
- Increment the manifest version only for a release.

YouTube's page structure and internal endpoints can change without notice. Prefer the smallest robust adaptation and document selectors or request-shape changes in the pull request.
