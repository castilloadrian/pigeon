<div align="center">

# pigeon, a goose fork

_a local, extensible, open source AI agent that automates engineering tasks_

<p align="center">
  <a href="https://opensource.org/licenses/Apache-2.0">
    <img src="https://img.shields.io/badge/License-Apache_2.0-blue.svg">
  </a>
</p>
</div>

pigeon is a fork of goose, built with a focus on providing a powerful user interface and companion for interacting with your favorite llms and mcp servers.

unlike goose, which emphasizes direct task execution, pigeon is designed to be your on-machine ai agent—making it easier to query models, automate complex development workflows, and manage projects end to end.

whether you’re prototyping ideas, refining code, or orchestrating sophisticated engineering pipelines, pigeon streamlines the process by offering a seamless interface to connect with your chosen tools. it supports any llm, enables multi-model configurations to balance performance and cost, and integrates natively with mcp servers.

refer to block/goose if you would like to contribute. pigeon will see less updates as it will be tailored to perform a certain task

## Getting Started

### Rust

First let's compile goose and try it out

```
cargo build
```

when that is done, you should now have debug builds of the binaries like the goose cli:

```
./target/debug/goose --help
```

If you haven't used the CLI before, you can use this compiled version to do first time configuration:

```
./target/debug/goose configure
```

And then once you have a connection to an LLM provider working, you can run a session!

```
./target/debug/goose session
```

These same commands can be recompiled and immediately run using `cargo run -p goose-cli` for iteration.
As you make changes to the rust code, you can try it out on the CLI, or also run checks, tests, and linter:

```
cargo check  # do your changes compile
cargo test  # do the tests pass with your changes
cargo fmt   # format your code
./scripts/clippy-lint.sh # run the linter
```

### Node

Now let's make sure you can run the app.

```
just run-ui
```

The start gui will both build a release build of rust (as if you had done `cargo build -r`) and start the electron process.
You should see the app open a window, and drop you into first time setup. When you've gone through the setup,
you can talk to goose!

You can now make changes in the code in ui/desktop to iterate on the GUI half of goose.

### Regenerating the OpenAPI schema

The file `ui/desktop/openapi.json` is automatically generated during the build.
It is written by the `generate_schema` binary in `crates/goose-server`.
If you need to update the spec without starting the UI, run:

```
just generate-openapi
```

This command regenerates `ui/desktop/openapi.json` and then runs the UI's
`generate-api` script to rebuild the TypeScript client from that spec.

Changes to the API should be made in the Rust source under `crates/goose-server/src/`.

# Goose Quick Links
- [Quickstart](https://block.github.io/goose/docs/quickstart)
- [Installation](https://block.github.io/goose/docs/getting-started/installation)
- [Tutorials](https://block.github.io/goose/docs/category/tutorials)
- [Documentation](https://block.github.io/goose/docs/category/getting-started)
