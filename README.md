# obsidian-navigator-api

A minimal local REST‐API server for Obsidian vault navigation—designed for desktop use and intended to power a Neovim-based note-taking workflow.

## Overview

`obsidian-navigator-api` spins up a lightweight, **insecure** HTTP server on your desktop that exposes Obsidian navigation operations via REST endpoints. You can continue to use the Obsidian app as your primary preview, but you can drive note navigation directly from Neovim (or any HTTP client) in your terminal.

## Initial Vision

While v0.1.0 focuses purely on REST APIs, the long-term idea is to build a bridge between Neovim (in the terminal) and the Obsidian app—letting you navigate and manipulate your vault without ever leaving your favorite editor.

## Motivation

I love Neovim’s speed and muscle-memory, but switching back and forth to Obsidian to preview notes felt disruptive.
This plugin is my first standalone plugin project, created as a learning tool and born out of a desire to

1. **Learn** and grow my technical skills through this standalone plugin—an important milestone in my personal development.
2. **Bridge** the gap between Neovim and Obsidian, marrying the best of both worlds.
3. **Streamline** my note-taking workflow so I never have to break focus.

## ⚠️ Project Status

> Under private development; open source release planned at v1.0.0.
> Not accepting external contributions yet.

## Credits

This project is inspired by [obsidian-bridge.nvim](https://github.com/oflisback/obsidian-bridge.nvim) by [oflisback](https://github.com/oflisback) and [obsidian-local-rest-api](https://github.com/coddingtonbear/obsidian-local-rest-api) by [coddingtonbear](https://github.com/coddingtonbear) which sparks my interest in building a plugin that can streamline the process of note-taking using obsidian.
