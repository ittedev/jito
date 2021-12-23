# [Choice] Ubuntu version (use hirsuite or bionic on local arm64/Apple Silicon): hirsute, focal, bionic
ARG VARIANT=focal
FROM mcr.microsoft.com/vscode/devcontainers/base:${VARIANT}

ENV PATH /home/vscode/.deno/bin:$PATH

# [Optional] Uncomment this section to install additional OS packages.
RUN sudo -u vscode deno install --allow-net --allow-read https://deno.land/std@0.106.0/http/file_server.ts
